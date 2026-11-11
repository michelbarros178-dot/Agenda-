# Diseño del Sistema y Especificación Ejecutable: Agenda de Tareas y Compromisos

## 1. Estructura del Proyecto (Clean Architecture & TypeScript Estricto)

```text
src/
├── domain/
│   ├── entities/
│   │   ├── Task.ts
│   │   └── Commitment.ts
│   ├── enums/
│   │   ├── TaskPriority.ts
│   │   ├── TaskStatus.ts
│   │   └── CommitmentStatus.ts
│   └── exceptions/
│       ├── TaskValidationException.ts
│       └── ScheduleConflictException.ts
├── application/
│   ├── dtos/
│   │   ├── CreateTaskDTO.ts
│   │   └── CreateCommitmentDTO.ts
│   ├── repositories/
│   │   ├── TaskRepository.ts
│   │   └── CommitmentRepository.ts
│   └── services/
│       ├── TaskService.ts
│       └── CommitmentService.ts
├── infrastructure/
│   └── persistence/
│       ├── InMemoryTaskRepository.ts
│       └── InMemoryCommitmentRepository.ts
├── ui/
│   └── (Interfaz futurista 3D con Three.js y Glassmorphism)
└── tests/
    ├── TaskService.spec.ts
    └── CommitmentService.spec.ts
```

---

## 2. Código TypeScript Completo (`strict: true`, sin `any`)

### `src/domain/enums/TaskPriority.ts`
```typescript
export enum TaskPriority {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  CRITICA = 'CRITICA'
}
```

### `src/domain/enums/TaskStatus.ts`
```typescript
export enum TaskStatus {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA'
}
```

### `src/domain/enums/CommitmentStatus.ts`
```typescript
export enum CommitmentStatus {
  PROGRAMADO = 'PROGRAMADO',
  CONFIRMADO = 'CONFIRMADO',
  CANCELADO = 'CANCELADO'
}
```

### `src/domain/exceptions/TaskValidationException.ts`
```typescript
export class TaskValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskValidationException';
    Object.setPrototypeOf(this, TaskValidationException.prototype);
  }
}
```

### `src/domain/exceptions/ScheduleConflictException.ts`
```typescript
export class ScheduleConflictException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScheduleConflictException';
    Object.setPrototypeOf(this, ScheduleConflictException.prototype);
  }
}
```

### `src/domain/entities/Task.ts`
```typescript
import { TaskPriority } from '../enums/TaskPriority';
import { TaskStatus } from '../enums/TaskStatus';

export type UUID = string;

export class Task {
  constructor(
    public readonly id: UUID,
    public titulo: string,
    public descripcion: string | undefined,
    public fechaVencimiento: Date,
    public prioridad: TaskPriority,
    public estado: TaskStatus,
    public etiquetas: string[] = []
  ) {}
}
```

### `src/domain/entities/Commitment.ts`
```typescript
import { CommitmentStatus } from '../enums/CommitmentStatus';
import { UUID } from './Task';

export class Commitment {
  constructor(
    public readonly id: UUID,
    public titulo: string,
    public descripcion: string | undefined,
    public fechaInicio: Date,
    public fechaFin: Date,
    public ubicacion: string | undefined,
    public participantes: string[],
    public estado: CommitmentStatus,
    public minutosRecordatorio: number = 15
  ) {}
}
```

### `src/application/dtos/CreateTaskDTO.ts`
```typescript
import { TaskPriority } from '../../domain/enums/TaskPriority';

export interface CreateTaskDTO {
  titulo: string;
  descripcion?: string;
  fechaVencimiento: Date;
  prioridad: TaskPriority;
  etiquetas?: string[];
}
```

### `src/application/dtos/CreateCommitmentDTO.ts`
```typescript
import { UUID } from '../../domain/entities/Task';

export interface CreateCommitmentDTO {
  creadorId: UUID;
  titulo: string;
  descripcion?: string;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacion?: string;
  participantes: string[];
  minutosRecordatorio?: number;
}
```

### `src/application/repositories/TaskRepository.ts`
```typescript
import { Task, UUID } from '../../domain/entities/Task';

export interface TaskRepository {
  save(task: Task): Promise<Task>;
  findById(id: UUID): Promise<Task | null>;
  findAll(): Promise<Task[]>;
}
```

### `src/application/repositories/CommitmentRepository.ts`
```typescript
import { Commitment } from '../../domain/entities/Commitment';
import { UUID } from '../../domain/entities/Task';

export interface CommitmentRepository {
  save(commitment: Commitment): Promise<Commitment>;
  findById(id: UUID): Promise<Commitment | null>;
  findByUserId(userId: UUID): Promise<Commitment[]>;
  findAll(): Promise<Commitment[]>;
}
```

### `src/infrastructure/persistence/InMemoryTaskRepository.ts`
```typescript
import { TaskRepository } from '../../application/repositories/TaskRepository';
import { Task, UUID } from '../../domain/entities/Task';

export class InMemoryTaskRepository implements TaskRepository {
  private tasks = new Map<UUID, Task>();

  async save(task: Task): Promise<Task> {
    this.tasks.set(task.id, new Task(
      task.id,
      task.titulo,
      task.descripcion,
      new Date(task.fechaVencimiento.getTime()),
      task.prioridad,
      task.estado,
      [...task.etiquetas]
    ));
    return this.tasks.get(task.id)!;
  }

  async findById(id: UUID): Promise<Task | null> {
    const task = this.tasks.get(id);
    return task ? task : null;
  }

  async findAll(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }
}
```

### `src/infrastructure/persistence/InMemoryCommitmentRepository.ts`
```typescript
import { CommitmentRepository } from '../../application/repositories/CommitmentRepository';
import { Commitment } from '../../domain/entities/Commitment';
import { UUID } from '../../domain/entities/Task';

export class InMemoryCommitmentRepository implements CommitmentRepository {
  private commitments = new Map<UUID, Commitment>();
  private userCommitments = new Map<UUID, Set<UUID>>();

  async save(commitment: Commitment): Promise<Commitment> {
    this.commitments.set(commitment.id, commitment);
    const creatorId = commitment.participantes[0];
    if (!this.userCommitments.has(creatorId)) {
      this.userCommitments.set(creatorId, new Set());
    }
    this.userCommitments.get(creatorId)!.add(commitment.id);
    return commitment;
  }

  async findById(id: UUID): Promise<Commitment | null> {
    const commitment = this.commitments.get(id);
    return commitment ? commitment : null;
  }

  async findByUserId(userId: UUID): Promise<Commitment[]> {
    const ids = this.userCommitments.get(userId);
    if (!ids) return [];
    const list: Commitment[] = [];
    for (const id of ids) {
      const c = this.commitments.get(id);
      if (c) list.push(c);
    }
    return list;
  }

  async findAll(): Promise<Commitment[]> {
    return Array.from(this.commitments.values());
  }
}
```

### `src/application/services/TaskService.ts`
```typescript
import { CreateTaskDTO } from '../dtos/CreateTaskDTO';
import { Task, UUID } from '../../domain/entities/Task';
import { TaskStatus } from '../../domain/enums/TaskStatus';
import { TaskRepository } from '../repositories/TaskRepository';
import { TaskValidationException } from '../../domain/exceptions/TaskValidationException';

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(dto: CreateTaskDTO, nowProvider: () => Date = () => new Date()): Promise<Task> {
    if (!dto.titulo || dto.titulo.trim().length === 0) {
      throw new TaskValidationException('El título de la tarea es requerido.');
    }
    if (dto.titulo.length > 100) {
      throw new TaskValidationException('El título no puede exceder 100 caracteres.');
    }
    if (dto.descripcion && dto.descripcion.length > 500) {
      throw new TaskValidationException('La descripción no puede exceder 500 caracteres.');
    }

    // RN-01: No se puede crear ni actualizar una tarea con fechaVencimiento en el pasado respecto al momento de creación.
    const now = nowProvider();
    if (dto.fechaVencimiento.getTime() < now.getTime()) {
      throw new TaskValidationException('RN-01: No se puede crear una tarea con fecha de vencimiento en el pasado.');
    }

    const newTask = new Task(
      crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      dto.titulo.trim(),
      dto.descripcion?.trim(),
      dto.fechaVencimiento,
      dto.prioridad,
      TaskStatus.PENDIENTE,
      dto.etiquetas || []
    );

    return this.taskRepository.save(newTask);
  }

  async updateTaskStatus(id: UUID, newStatus: TaskStatus): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new TaskValidationException(`Tarea con id ${id} no encontrada.`);
    }

    // RN-02: Una tarea COMPLETADA o CANCELADA no puede cambiar a EN_PROCESO o PENDIENTE.
    const isTerminalStatus = task.estado === TaskStatus.COMPLETADA || task.estado === TaskStatus.CANCELADA;
    const isTargetReverting = newStatus === TaskStatus.PENDIENTE || newStatus === TaskStatus.EN_PROCESO;

    if (isTerminalStatus && isTargetReverting) {
      throw new TaskValidationException(
        `RN-02: Una tarea en estado ${task.estado} no puede cambiar a ${newStatus}.`
      );
    }

    task.estado = newStatus;
    return this.taskRepository.save(task);
  }

  async getPendingTasksOverdue(now: Date): Promise<Task[]> {
    const all = await this.taskRepository.findAll();
    return all.filter(task => 
      task.estado === TaskStatus.PENDIENTE && task.fechaVencimiento.getTime() < now.getTime()
    );
  }
}
```

### `src/application/services/CommitmentService.ts`
```typescript
import { CreateCommitmentDTO } from '../dtos/CreateCommitmentDTO';
import { Commitment } from '../../domain/entities/Commitment';
import { CommitmentStatus } from '../../domain/enums/CommitmentStatus';
import { CommitmentRepository } from '../repositories/CommitmentRepository';
import { UUID } from '../../domain/entities/Task';
import { ScheduleConflictException } from '../../domain/exceptions/ScheduleConflictException';
import { TaskValidationException } from '../../domain/exceptions/TaskValidationException';

export class CommitmentService {
  // RFC 5322 regex estándar simplificado seguro
  private static readonly RFC5322_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  constructor(private readonly commitmentRepository: CommitmentRepository) {}

  async scheduleCommitment(dto: CreateCommitmentDTO): Promise<Commitment> {
    if (!dto.titulo || dto.titulo.trim().length === 0) {
      throw new TaskValidationException('El título del compromiso es requerido.');
    }
    if (dto.titulo.length > 100) {
      throw new TaskValidationException('El título no puede exceder 100 caracteres.');
    }

    // RN-04: La duración mínima entre fechaInicio y fechaFin es de al menos 15 minutos.
    const duracionMs = dto.fechaFin.getTime() - dto.fechaInicio.getTime();
    const quinceMinutosMs = 15 * 60 * 1000;
    if (dto.fechaFin <= dto.fechaInicio || duracionMs < quinceMinutosMs) {
      throw new TaskValidationException('RN-04: La duración mínima entre fechaInicio y fechaFin es de al menos 15 minutos (fechaFin > fechaInicio).');
    }

    // Entidad 2.2: Participantes mínimo 1, el creador
    if (!dto.participantes || dto.participantes.length === 0) {
      throw new TaskValidationException('Debe incluirse al menos un participante (el creador).');
    }
    if (dto.participantes[0] !== dto.creadorId) {
      throw new TaskValidationException('El primer participante debe ser el usuario creador.');
    }

    // RN-05: Todos los correos de participantes deben cumplir RFC 5322.
    for (const email of dto.participantes) {
      if (!CommitmentService.RFC5322_REGEX.test(email)) {
        throw new TaskValidationException(`RN-05: El correo participante '${email}' no cumple el formato RFC 5322.`);
      }
    }

    // RN-03: No se permite agendar un compromiso que se traslape con otro compromiso en estado PROGRAMADO o CONFIRMADO del mismo creador.
    // Rango de traslape: (NuevoInicio < ExistenteFin) Y (NuevoFin > ExistenteInicio)
    const hasConflict = await this.hasScheduleConflict(dto.creadorId, dto.fechaInicio, dto.fechaFin);
    if (hasConflict) {
      throw new ScheduleConflictException(
        `RN-03: Conflicto de horario detectado para el usuario ${dto.creadorId} en el intervalo solicitado.`
      );
    }

    const commitment = new Commitment(
      crypto.randomUUID ? crypto.randomUUID() : `comm-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      dto.titulo.trim(),
      dto.descripcion?.trim(),
      dto.fechaInicio,
      dto.fechaFin,
      dto.ubicacion?.trim(),
      [...dto.participantes],
      CommitmentStatus.PROGRAMADO,
      dto.minutosRecordatorio ?? 15
    );

    return this.commitmentRepository.save(commitment);
  }

  async cancelCommitment(id: UUID): Promise<void> {
    const commitment = await this.commitmentRepository.findById(id);
    if (!commitment) {
      throw new TaskValidationException(`Compromiso con id ${id} no encontrado.`);
    }
    commitment.estado = CommitmentStatus.CANCELADO;
    await this.commitmentRepository.save(commitment);
  }

  async hasScheduleConflict(userId: UUID, start: Date, end: Date): Promise<boolean> {
    const existing = await this.commitmentRepository.findByUserId(userId);
    return existing.some(c => {
      const isBlockingStatus = c.estado === CommitmentStatus.PROGRAMADO || c.estado === CommitmentStatus.CONFIRMADO;
      if (!isBlockingStatus) return false;

      // RN-03 Rango: (NuevoInicio < ExistenteFin) Y (NuevoFin > ExistenteInicio)
      const overlaps = (start.getTime() < c.fechaFin.getTime()) && (end.getTime() > c.fechaInicio.getTime());
      return overlaps;
    });
  }
}
```

---

## 3. Pruebas Unitarias Exhaustivas (Jest/Vitest)

### `tests/AgendaSuite.spec.ts`
```typescript
import { TaskService } from '../src/application/services/TaskService';
import { CommitmentService } from '../src/application/services/CommitmentService';
import { InMemoryTaskRepository } from '../src/infrastructure/persistence/InMemoryTaskRepository';
import { InMemoryCommitmentRepository } from '../src/infrastructure/persistence/InMemoryCommitmentRepository';
import { TaskPriority } from '../src/domain/enums/TaskPriority';
import { TaskStatus } from '../src/domain/enums/TaskStatus';
import { TaskValidationException } from '../src/domain/exceptions/TaskValidationException';
import { ScheduleConflictException } from '../src/domain/exceptions/ScheduleConflictException';

describe('Suite de Pruebas: Especificación SDD 1.0.0', () => {
  let taskService: TaskService;
  let commitmentService: CommitmentService;

  beforeEach(() => {
    taskService = new TaskService(new InMemoryTaskRepository());
    commitmentService = new CommitmentService(new InMemoryCommitmentRepository());
  });

  describe('RN-01: No fecha en el pasado al crear tarea', () => {
    test('Debe fallar al crear una tarea con vencimiento pasado', async () => {
      const fixedNow = new Date('2025-05-10T12:00:00Z');
      const past = new Date('2025-05-10T11:59:59Z');

      await expect(
        taskService.createTask({
          titulo: 'Tarea Pasada',
          fechaVencimiento: past,
          prioridad: TaskPriority.ALTA
        }, () => fixedNow)
      ).rejects.toThrow(TaskValidationException);
    });

    test('Debe permitir crear tarea con fecha presente o futura', async () => {
      const fixedNow = new Date('2025-05-10T12:00:00Z');
      const future = new Date('2025-05-10T13:00:00Z');

      const task = await taskService.createTask({
        titulo: 'Tarea Válida',
        fechaVencimiento: future,
        prioridad: TaskPriority.MEDIA
      }, () => fixedNow);

      expect(task.id).toBeDefined();
      expect(task.estado).toBe(TaskStatus.PENDIENTE);
    });
  });

  describe('RN-02: Transición de estado prohibida', () => {
    test('No debe permitir que COMPLETADA cambie a EN_PROCESO ni a PENDIENTE', async () => {
      const future = new Date(Date.now() + 86400000);
      const task = await taskService.createTask({
        titulo: 'Tarea 1',
        fechaVencimiento: future,
        prioridad: TaskPriority.CRITICA
      });

      await taskService.updateTaskStatus(task.id, TaskStatus.COMPLETADA);

      await expect(
        taskService.updateTaskStatus(task.id, TaskStatus.EN_PROCESO)
      ).rejects.toThrow(TaskValidationException);

      await expect(
        taskService.updateTaskStatus(task.id, TaskStatus.PENDIENTE)
      ).rejects.toThrow(TaskValidationException);
    });

    test('No debe permitir que CANCELADA cambie a EN_PROCESO o PENDIENTE', async () => {
      const future = new Date(Date.now() + 86400000);
      const task = await taskService.createTask({
        titulo: 'Tarea 2',
        fechaVencimiento: future,
        prioridad: TaskPriority.BAJA
      });

      await taskService.updateTaskStatus(task.id, TaskStatus.CANCELADA);

      await expect(
        taskService.updateTaskStatus(task.id, TaskStatus.PENDIENTE)
      ).rejects.toThrow(TaskValidationException);
    });
  });

  describe('RN-04: Duración mínima de 15 minutos en compromisos', () => {
    test('Caso límite: exactamente 15 minutos debe ser aceptado', async () => {
      const start = new Date('2025-06-01T10:00:00Z');
      const end15 = new Date('2025-06-01T10:15:00Z');
      const creator = 'lead@quantum.dev';

      const comm = await commitmentService.scheduleCommitment({
        creadorId: creator,
        titulo: 'Standup Express',
        fechaInicio: start,
        fechaFin: end15,
        participantes: [creator]
      });

      expect(comm.id).toBeDefined();
    });

    test('Duración menor a 15 minutos (14m 59s) debe lanzar TaskValidationException', async () => {
      const start = new Date('2025-06-01T10:00:00Z');
      const end14 = new Date('2025-06-01T10:14:59Z');
      const creator = 'lead@quantum.dev';

      await expect(
        commitmentService.scheduleCommitment({
          creadorId: creator,
          titulo: 'Reunión Relámpago',
          fechaInicio: start,
          fechaFin: end14,
          participantes: [creator]
        })
      ).rejects.toThrow(TaskValidationException);
    });
  });

  describe('RN-05: Validación estricta de correo RFC 5322', () => {
    test('Debe fallar si cualquier correo de participante es inválido', async () => {
      const start = new Date('2025-06-01T10:00:00Z');
      const end = new Date('2025-06-01T10:30:00Z');
      const creator = 'lead@quantum.dev';

      await expect(
        commitmentService.scheduleCommitment({
          creadorId: creator,
          titulo: 'Sync con Cliente',
          fechaInicio: start,
          fechaFin: end,
          participantes: [creator, 'correo_invalido_sin_arroba.com']
        })
      ).rejects.toThrow(TaskValidationException);
    });
  });

  describe('RN-03: Detección estricta de traslapes en compromisos', () => {
    const creator = 'lead@quantum.dev';
    const baseStart = new Date('2025-06-01T14:00:00Z');
    const baseEnd = new Date('2025-06-01T15:00:00Z');

    beforeEach(async () => {
      await commitmentService.scheduleCommitment({
        creadorId: creator,
        titulo: 'Bloque Base (14:00 - 15:00)',
        fechaInicio: baseStart,
        fechaFin: baseEnd,
        participantes: [creator]
      });
    });

    test('Traslape interior debe lanzar ScheduleConflictException', async () => {
      await expect(
        commitmentService.scheduleCommitment({
          creadorId: creator,
          titulo: 'Traslape Interior',
          fechaInicio: new Date('2025-06-01T14:15:00Z'),
          fechaFin: new Date('2025-06-01T14:45:00Z'),
          participantes: [creator]
        })
      ).rejects.toThrow(ScheduleConflictException);
    });

    test('Caso límite en extremos contiguos (exactamente al inicio o al fin) NO es traslape', async () => {
      // Justo antes: 13:00 a 14:00 (NuevoFin == ExistenteInicio -> NO cumple NuevoFin > ExistenteInicio)
      const prev = await commitmentService.scheduleCommitment({
        creadorId: creator,
        titulo: 'Bloque Previo Contiguo',
        fechaInicio: new Date('2025-06-01T13:00:00Z'),
        fechaFin: new Date('2025-06-01T14:00:00Z'),
        participantes: [creator]
      });
      expect(prev.id).toBeDefined();

      // Justo después: 15:00 a 15:30 (NuevoInicio == ExistenteFin -> NO cumple NuevoInicio < ExistenteFin)
      const next = await commitmentService.scheduleCommitment({
        creadorId: creator,
        titulo: 'Bloque Posterior Contiguo',
        fechaInicio: new Date('2025-06-01T15:00:00Z'),
        fechaFin: new Date('2025-06-01T15:30:00Z'),
        participantes: [creator]
      });
      expect(next.id).toBeDefined();
    });

    test('Un compromiso CANCELADO no debe generar conflicto', async () => {
      const conflictStart = new Date('2025-06-01T16:00:00Z');
      const conflictEnd = new Date('2025-06-01T17:00:00Z');

      const toCancel = await commitmentService.scheduleCommitment({
        creadorId: creator,
        titulo: 'Para Cancelar',
        fechaInicio: conflictStart,
        fechaFin: conflictEnd,
        participantes: [creator]
      });

      await commitmentService.cancelCommitment(toCancel.id);

      // Ahora agendamos en el mismo horario y debe permitirlo
      const replaced = await commitmentService.scheduleCommitment({
        creadorId: creator,
        titulo: 'Nuevo Bloque Desbloqueado',
        fechaInicio: conflictStart,
        fechaFin: conflictEnd,
        participantes: [creator]
      });

      expect(replaced.id).toBeDefined();
    });
  });
});
```

---

## 4. Instrucciones de Compilación y Ejecución

```bash
# 1. Instalar dependencias
npm install typescript @types/node jest @types/jest ts-jest --save-dev

# 2. Compilar TypeScript en modo estricto
npx tsc --noEmit

# 3. Ejecutar la suite de pruebas unitarias
npx jest --verbose
```
