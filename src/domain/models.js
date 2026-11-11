// Domain Enums & Exceptions
const TaskPriority = Object.freeze({
  BAJA: 'BAJA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
  CRITICA: 'CRITICA'
});

const TaskStatus = Object.freeze({
  PENDIENTE: 'PENDIENTE',
  EN_PROCESO: 'EN_PROCESO',
  COMPLETADA: 'COMPLETADA',
  CANCELADA: 'CANCELADA'
});

const CommitmentStatus = Object.freeze({
  PROGRAMADO: 'PROGRAMADO',
  CONFIRMADO: 'CONFIRMADO',
  CANCELADO: 'CANCELADO'
});

class TaskValidationException extends Error {
  constructor(message) {
    super(message);
    this.name = 'TaskValidationException';
  }
}

class ScheduleConflictException extends Error {
  constructor(message) {
    super(message);
    this.name = 'ScheduleConflictException';
  }
}

class Task {
  constructor(id, titulo, descripcion, fechaVencimiento, prioridad, estado = TaskStatus.PENDIENTE, etiquetas = []) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fechaVencimiento = new Date(fechaVencimiento);
    this.prioridad = prioridad;
    this.estado = estado;
    this.etiquetas = Array.isArray(etiquetas) ? etiquetas : [];
  }
}

class Commitment {
  constructor(id, creadorId, titulo, descripcion, fechaInicio, fechaFin, ubicacion, participantes, estado = CommitmentStatus.PROGRAMADO, minutosRecordatorio = 15) {
    this.id = id;
    this.creadorId = creadorId;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fechaInicio = new Date(fechaInicio);
    this.fechaFin = new Date(fechaFin);
    this.ubicacion = ubicacion;
    this.participantes = Array.isArray(participantes) ? participantes : [creadorId];
    this.estado = estado;
    this.minutosRecordatorio = minutosRecordatorio;
  }
}

module.exports = {
  TaskPriority,
  TaskStatus,
  CommitmentStatus,
  TaskValidationException,
  ScheduleConflictException,
  Task,
  Commitment
};

