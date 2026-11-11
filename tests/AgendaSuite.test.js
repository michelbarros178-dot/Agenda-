const test = require('node:test');
const assert = require('node:assert/strict');

const { TaskService, CommitmentService } = require('../src/application/services');
const { InMemoryTaskRepository, InMemoryCommitmentRepository } = require('../src/infrastructure/repositories');
const { TaskPriority, TaskStatus, TaskValidationException, ScheduleConflictException } = require('../src/domain/models');
const { sanitizeValue } = require('../src/security/sanitizer');
const { VALID_OPERATORS } = require('../src/security/auth');

test('Suite de Pruebas SDD & Capas de Seguridad ChronoCore', async (t) => {
  let taskService;
  let commitmentService;

  t.beforeEach(() => {
    taskService = new TaskService(new InMemoryTaskRepository());
    commitmentService = new CommitmentService(new InMemoryCommitmentRepository());
  });

  // ------------------------------------------------------------------------
  // REGLA RN-01
  // ------------------------------------------------------------------------
  await t.test('RN-01: Debe fallar al crear una tarea con vencimiento en el pasado', async () => {
    const fixedNow = new Date('2026-06-01T12:00:00Z');
    const past = new Date('2026-06-01T11:59:59Z');

    await assert.rejects(
      async () => {
        await taskService.createTask({
          titulo: 'Tarea Pasada',
          fechaVencimiento: past,
          prioridad: TaskPriority.ALTA
        }, () => fixedNow);
      },
      (err) => {
        assert(err instanceof TaskValidationException);
        assert(err.message.includes('RN-01'));
        return true;
      }
    );
  });

  await t.test('RN-01: Debe permitir crear tarea con fecha presente o futura', async () => {
    const fixedNow = new Date('2026-06-01T12:00:00Z');
    const future = new Date('2026-06-01T13:00:00Z');

    const task = await taskService.createTask({
      titulo: 'Tarea Válida',
      fechaVencimiento: future,
      prioridad: TaskPriority.MEDIA
    }, () => fixedNow);

    assert(task.id);
    assert.equal(task.estado, TaskStatus.PENDIENTE);
  });

  // ------------------------------------------------------------------------
  // REGLA RN-02
  // ------------------------------------------------------------------------
  await t.test('RN-02: No debe permitir que COMPLETADA cambie a EN_PROCESO ni a PENDIENTE', async () => {
    const future = new Date(Date.now() + 86400000);
    const task = await taskService.createTask({
      titulo: 'Tarea Inmutable 1',
      fechaVencimiento: future,
      prioridad: TaskPriority.CRITICA
    });

    await taskService.updateTaskStatus(task.id, TaskStatus.COMPLETADA);

    await assert.rejects(
      async () => {
        await taskService.updateTaskStatus(task.id, TaskStatus.EN_PROCESO);
      },
      (err) => {
        assert(err instanceof TaskValidationException);
        assert(err.message.includes('RN-02'));
        return true;
      }
    );

    await assert.rejects(
      async () => {
        await taskService.updateTaskStatus(task.id, TaskStatus.PENDIENTE);
      },
      (err) => {
        assert(err instanceof TaskValidationException);
        assert(err.message.includes('RN-02'));
        return true;
      }
    );
  });

  await t.test('RN-02: No debe permitir que CANCELADA cambie a EN_PROCESO o PENDIENTE', async () => {
    const future = new Date(Date.now() + 86400000);
    const task = await taskService.createTask({
      titulo: 'Tarea Inmutable 2',
      fechaVencimiento: future,
      prioridad: TaskPriority.BAJA
    });

    await taskService.updateTaskStatus(task.id, TaskStatus.CANCELADA);

    await assert.rejects(
      async () => {
        await taskService.updateTaskStatus(task.id, TaskStatus.PENDIENTE);
      },
      (err) => {
        assert(err instanceof TaskValidationException);
        assert(err.message.includes('RN-02'));
        return true;
      }
    );
  });

  // ------------------------------------------------------------------------
  // REGLA RN-04
  // ------------------------------------------------------------------------
  await t.test('RN-04: Caso límite: exactamente 15 minutos debe ser aceptado', async () => {
    const start = new Date('2026-06-01T10:00:00Z');
    const end15 = new Date('2026-06-01T10:15:00Z');
    const creator = 'lead@quantum.dev';

    const comm = await commitmentService.scheduleCommitment({
      creadorId: creator,
      titulo: 'Standup Express 15 min',
      fechaInicio: start,
      fechaFin: end15,
      participantes: [creator]
    });

    assert(comm.id);
  });

  await t.test('RN-04: Duración menor a 15 minutos (14m 59s) debe lanzar excepción', async () => {
    const start = new Date('2026-06-01T10:00:00Z');
    const end14 = new Date('2026-06-01T10:14:59Z');
    const creator = 'lead@quantum.dev';

    await assert.rejects(
      async () => {
        await commitmentService.scheduleCommitment({
          creadorId: creator,
          titulo: 'Reunión Relámpago',
          fechaInicio: start,
          fechaFin: end14,
          participantes: [creator]
        });
      },
      (err) => {
        assert(err instanceof TaskValidationException);
        assert(err.message.includes('RN-04'));
        return true;
      }
    );
  });

  // ------------------------------------------------------------------------
  // REGLA RN-05
  // ------------------------------------------------------------------------
  await t.test('RN-05: Debe fallar si cualquier correo de participante es inválido según RFC 5322', async () => {
    const start = new Date('2026-06-01T10:00:00Z');
    const end = new Date('2026-06-01T10:30:00Z');
    const creator = 'lead@quantum.dev';

    await assert.rejects(
      async () => {
        await commitmentService.scheduleCommitment({
          creadorId: creator,
          titulo: 'Sync con Cliente',
          fechaInicio: start,
          fechaFin: end,
          participantes: [creator, 'correo_invalido_sin_arroba.com']
        });
      },
      (err) => {
        assert(err instanceof TaskValidationException);
        assert(err.message.includes('RN-05'));
        return true;
      }
    );
  });

  // ------------------------------------------------------------------------
  // REGLA RN-03
  // ------------------------------------------------------------------------
  await t.test('RN-03: Detección estricta de traslapes en compromisos', async () => {
    const creator = 'commander@chronocore.space';
    const baseStart = new Date('2026-06-01T14:00:00Z');
    const baseEnd = new Date('2026-06-01T15:00:00Z');

    await commitmentService.scheduleCommitment({
      creadorId: creator,
      titulo: 'Bloque Base Alfa (14:00 - 15:00)',
      fechaInicio: baseStart,
      fechaFin: baseEnd,
      participantes: [creator]
    });

    // Traslape interior
    await assert.rejects(
      async () => {
        await commitmentService.scheduleCommitment({
          creadorId: creator,
          titulo: 'Traslape Interior 14:15 - 14:45',
          fechaInicio: new Date('2026-06-01T14:15:00Z'),
          fechaFin: new Date('2026-06-01T14:45:00Z'),
          participantes: [creator]
        });
      },
      (err) => {
        assert(err instanceof ScheduleConflictException);
        assert(err.message.includes('RN-03'));
        return true;
      }
    );

    // Extremo contiguo previo (13:00 - 14:00) NO es traslape
    const prev = await commitmentService.scheduleCommitment({
      creadorId: creator,
      titulo: 'Bloque Previo Contiguo',
      fechaInicio: new Date('2026-06-01T13:00:00Z'),
      fechaFin: new Date('2026-06-01T14:00:00Z'),
      participantes: [creator]
    });
    assert(prev.id);

    // Extremo contiguo posterior (15:00 - 15:30) NO es traslape
    const next = await commitmentService.scheduleCommitment({
      creadorId: creator,
      titulo: 'Bloque Posterior Contiguo',
      fechaInicio: new Date('2026-06-01T15:00:00Z'),
      fechaFin: new Date('2026-06-01T15:30:00Z'),
      participantes: [creator]
    });
    assert(next.id);
  });

  await t.test('RN-03: Un compromiso CANCELADO no debe generar conflicto', async () => {
    const creator = 'commander@chronocore.space';
    const conflictStart = new Date('2026-06-01T16:00:00Z');
    const conflictEnd = new Date('2026-06-01T17:00:00Z');

    const toCancel = await commitmentService.scheduleCommitment({
      creadorId: creator,
      titulo: 'Para Cancelar',
      fechaInicio: conflictStart,
      fechaFin: conflictEnd,
      participantes: [creator]
    });

    await commitmentService.cancelCommitment(toCancel.id);

    // Debe permitir agendar en el mismo horario liberado
    const replaced = await commitmentService.scheduleCommitment({
      creadorId: creator,
      titulo: 'Nuevo Bloque Desbloqueado',
      fechaInicio: conflictStart,
      fechaFin: conflictEnd,
      participantes: [creator]
    });
    assert(replaced.id);
  });

  // ------------------------------------------------------------------------
  // CAPAS DE SEGURIDAD
  // ------------------------------------------------------------------------
  await t.test('SEGURIDAD: Sanitizador neutraliza scripts maliciosos y eventos XSS', () => {
    const malicious = '<script>alert("hacked")</script>Inspección de bobinas<iframe src="evil.com"></iframe>';
    const cleaned = sanitizeValue(malicious);
    assert(!cleaned.includes('<script>'));
    assert(!cleaned.includes('<iframe>'));
    assert(cleaned.includes('Inspección de bobinas'));
  });

  await t.test('SEGURIDAD: Tokens de operadores orbitales y control RBAC configurados', () => {
    const commander = VALID_OPERATORS.get('orbital-token-alpha-7');
    assert(commander);
    assert.equal(commander.role, 'COMMANDER');
    assert(commander.permissions.includes('tasks:write'));
    assert(commander.permissions.includes('audit:read'));
  });
});

