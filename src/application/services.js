const {
  TaskPriority,
  TaskStatus,
  CommitmentStatus,
  TaskValidationException,
  ScheduleConflictException,
  Task,
  Commitment
} = require('../domain/models');

const crypto = require('crypto');

class TaskService {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async createTask(dto, nowProvider = () => new Date()) {
    if (!dto.titulo || typeof dto.titulo !== 'string' || dto.titulo.trim().length === 0) {
      throw new TaskValidationException('El título de la tarea es requerido.');
    }
    if (dto.titulo.length > 100) {
      throw new TaskValidationException('El título no puede exceder 100 caracteres.');
    }
    if (dto.descripcion && dto.descripcion.length > 500) {
      throw new TaskValidationException('La descripción no puede exceder 500 caracteres.');
    }

    const dueDate = new Date(dto.fechaVencimiento);
    if (isNaN(dueDate.getTime())) {
      throw new TaskValidationException('La fecha de vencimiento no tiene un formato válido.');
    }

    // RN-01: No se puede crear ni actualizar una tarea con fechaVencimiento en el pasado
    const now = nowProvider();
    if (dueDate.getTime() < now.getTime()) {
      throw new TaskValidationException('RN-01: No se puede crear una tarea con fecha de vencimiento en el pasado.');
    }

    // Validate Priority
    const priority = dto.prioridad || TaskPriority.MEDIA;
    if (!Object.values(TaskPriority).includes(priority)) {
      throw new TaskValidationException(`Prioridad '${priority}' no reconocida.`);
    }

    const id = dto.id || (crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);

    const newTask = new Task(
      id,
      dto.titulo.trim(),
      dto.descripcion ? dto.descripcion.trim() : undefined,
      dueDate,
      priority,
      TaskStatus.PENDIENTE,
      Array.isArray(dto.etiquetas) ? dto.etiquetas.map(t => String(t).trim()) : []
    );

    return this.taskRepository.save(newTask);
  }

  async updateTaskStatus(id, newStatus) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new TaskValidationException(`Tarea con id ${id} no encontrada.`);
    }

    if (!Object.values(TaskStatus).includes(newStatus)) {
      throw new TaskValidationException(`Estado '${newStatus}' no es válido.`);
    }

    // RN-02: Una tarea COMPLETADA o CANCELADA no puede cambiar a EN_PROCESO o PENDIENTE.
    const isTerminalStatus = (task.estado === TaskStatus.COMPLETADA || task.estado === TaskStatus.CANCELADA);
    const isTargetReverting = (newStatus === TaskStatus.PENDIENTE || newStatus === TaskStatus.EN_PROCESO);

    if (isTerminalStatus && isTargetReverting) {
      throw new TaskValidationException(
        `RN-02: Una tarea en estado ${task.estado} no puede cambiar a ${newStatus}.`
      );
    }

    task.estado = newStatus;
    return this.taskRepository.save(task);
  }

  async getPendingTasksOverdue(now = new Date()) {
    const all = await this.taskRepository.findAll();
    return all.filter(task =>
      task.estado === TaskStatus.PENDIENTE && task.fechaVencimiento.getTime() < now.getTime()
    );
  }

  async getAllTasks() {
    return this.taskRepository.findAll();
  }

  async getTaskById(id) {
    return this.taskRepository.findById(id);
  }
}

class CommitmentService {
  // RFC 5322 regex estándar simplificado seguro
  static RFC5322_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  constructor(commitmentRepository) {
    this.commitmentRepository = commitmentRepository;
  }

  async scheduleCommitment(dto) {
    if (!dto.titulo || typeof dto.titulo !== 'string' || dto.titulo.trim().length === 0) {
      throw new TaskValidationException('El título del compromiso es requerido.');
    }
    if (dto.titulo.length > 100) {
      throw new TaskValidationException('El título no puede exceder 100 caracteres.');
    }

    const start = new Date(dto.fechaInicio);
    const end = new Date(dto.fechaFin);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new TaskValidationException('Las fechas de inicio y fin deben ser fechas válidas.');
    }

    // RN-04: La duración mínima entre fechaInicio y fechaFin es de al menos 15 minutos (fechaFin > fechaInicio).
    const duracionMs = end.getTime() - start.getTime();
    const quinceMinutosMs = 15 * 60 * 1000;
    if (end <= start || duracionMs < quinceMinutosMs) {
      throw new TaskValidationException('RN-04: La duración mínima entre fechaInicio y fechaFin es de al menos 15 minutos (fechaFin > fechaInicio).');
    }

    // Participantes: mínimo 1 (el creador)
    const creatorId = (dto.creadorId || (dto.participantes && dto.participantes[0]) || '').trim();
    if (!creatorId) {
      throw new TaskValidationException('El identificador del creador es requerido.');
    }

    const participantes = Array.isArray(dto.participantes) && dto.participantes.length > 0 
      ? dto.participantes.map(p => String(p).trim())
      : [creatorId];

    if (participantes[0] !== creatorId) {
      throw new TaskValidationException('El primer participante debe ser el usuario creador.');
    }

    // RN-05: Todos los correos de participantes deben cumplir RFC 5322.
    for (const email of participantes) {
      if (!CommitmentService.RFC5322_REGEX.test(email)) {
        throw new TaskValidationException(`RN-05: El correo participante '${email}' no cumple el formato RFC 5322.`);
      }
    }

    // RN-03: No se permite agendar un compromiso que se traslape con otro compromiso en estado PROGRAMADO o CONFIRMADO del mismo creador.
    // Rango de traslape: (NuevoInicio < ExistenteFin) Y (NuevoFin > ExistenteInicio)
    const hasConflict = await this.hasScheduleConflict(creatorId, start, end);
    if (hasConflict) {
      throw new ScheduleConflictException(
        `RN-03: Conflicto de horario detectado para el usuario ${creatorId} en el intervalo solicitado.`
      );
    }

    const id = dto.id || (crypto.randomUUID ? crypto.randomUUID() : `comm-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);

    const commitment = new Commitment(
      id,
      creatorId,
      dto.titulo.trim(),
      dto.descripcion ? dto.descripcion.trim() : undefined,
      start,
      end,
      dto.ubicacion ? dto.ubicacion.trim() : undefined,
      [...participantes],
      CommitmentStatus.PROGRAMADO,
      dto.minutosRecordatorio ?? 15
    );

    return this.commitmentRepository.save(commitment);
  }

  async cancelCommitment(id) {
    const commitment = await this.commitmentRepository.findById(id);
    if (!commitment) {
      throw new TaskValidationException(`Compromiso con id ${id} no encontrado.`);
    }
    commitment.estado = CommitmentStatus.CANCELADO;
    return this.commitmentRepository.save(commitment);
  }

  async hasScheduleConflict(userId, start, end) {
    const existing = await this.commitmentRepository.findByUserId(userId);
    return existing.some(c => {
      const isBlockingStatus = (c.estado === CommitmentStatus.PROGRAMADO || c.estado === CommitmentStatus.CONFIRMADO);
      if (!isBlockingStatus) return false;

      // RN-03 Rango: (NuevoInicio < ExistenteFin) Y (NuevoFin > ExistenteInicio)
      const overlaps = (start.getTime() < c.fechaFin.getTime()) && (end.getTime() > c.fechaInicio.getTime());
      return overlaps;
    });
  }

  async getAllCommitments() {
    return this.commitmentRepository.findAll();
  }

  async getCommitmentById(id) {
    return this.commitmentRepository.findById(id);
  }
}

module.exports = {
  TaskService,
  CommitmentService
};

