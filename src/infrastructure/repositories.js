const fs = require('fs');
const path = require('path');
const { Task, Commitment, TaskStatus, TaskPriority, CommitmentStatus } = require('../domain/models');

class InMemoryTaskRepository {
  constructor() {
    this.tasks = new Map();
  }

  async save(task) {
    const clone = new Task(
      task.id,
      task.titulo,
      task.descripcion,
      new Date(task.fechaVencimiento.getTime()),
      task.prioridad,
      task.estado,
      [...task.etiquetas]
    );
    this.tasks.set(task.id, clone);
    return clone;
  }

  async findById(id) {
    const task = this.tasks.get(id);
    return task ? task : null;
  }

  async findAll() {
    return Array.from(this.tasks.values());
  }

  async delete(id) {
    return this.tasks.delete(id);
  }
}

class InMemoryCommitmentRepository {
  constructor() {
    this.commitments = new Map();
    this.userCommitments = new Map();
  }

  async save(commitment) {
    this.commitments.set(commitment.id, commitment);
    const creatorId = commitment.creadorId || (commitment.participantes && commitment.participantes[0]) || 'system';
    if (!this.userCommitments.has(creatorId)) {
      this.userCommitments.set(creatorId, new Set());
    }
    this.userCommitments.get(creatorId).add(commitment.id);
    return commitment;
  }

  async findById(id) {
    const commitment = this.commitments.get(id);
    return commitment ? commitment : null;
  }

  async findByUserId(userId) {
    const ids = this.userCommitments.get(userId);
    if (!ids) return [];
    const list = [];
    for (const id of ids) {
      const c = this.commitments.get(id);
      if (c) list.push(c);
    }
    return list;
  }

  async findAll() {
    return Array.from(this.commitments.values());
  }
}

/**
 * Repositorio persistente en archivo JSON
 * Garantiza durabilidad entre reinicios del servidor respetando Clean Architecture
 */
class FilePersistenceRepository {
  constructor(storageFilePath) {
    this.storagePath = storageFilePath || path.resolve(__dirname, '../../.data/store.json');
    this.taskRepo = new InMemoryTaskRepository();
    this.commitmentRepo = new InMemoryCommitmentRepository();
    this._initStorage();
  }

  _initStorage() {
    const dir = path.dirname(this.storagePath);
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (e) {
        // En caso de que no tenga permisos de escritura, operará en memoria
      }
    }
    this._load();
  }

  _load() {
    try {
      if (fs.existsSync(this.storagePath)) {
        const raw = fs.readFileSync(this.storagePath, 'utf8');
        const data = JSON.parse(raw);
        if (data.tasks && Array.isArray(data.tasks)) {
          for (const t of data.tasks) {
            this.taskRepo.save(new Task(
              t.id,
              t.titulo,
              t.descripcion,
              new Date(t.fechaVencimiento),
              t.prioridad,
              t.estado,
              t.etiquetas
            ));
          }
        }
        if (data.commitments && Array.isArray(data.commitments)) {
          for (const c of data.commitments) {
            this.commitmentRepo.save(new Commitment(
              c.id,
              c.titulo,
              c.descripcion,
              new Date(c.fechaInicio),
              new Date(c.fechaFin),
              c.participantes,
              c.ubicacion,
              c.estado,
              c.creadorId
            ));
          }
        }
      }
    } catch (err) {
      console.warn('[STORAGE]: Advertencia al cargar datos persistentes:', err.message);
    }
  }

  _persist() {
    try {
      const tasks = Array.from(this.taskRepo.tasks.values());
      const commitments = Array.from(this.commitmentRepo.commitments.values());
      const payload = JSON.stringify({
        updatedAt: new Date().toISOString(),
        tasks,
        commitments
      }, null, 2);
      fs.writeFileSync(this.storagePath, payload, 'utf8');
    } catch (err) {
      console.warn('[STORAGE]: Advertencia al guardar datos persistentes:', err.message);
    }
  }

  getTaskRepository() {
    const self = this;
    return {
      save: async (task) => {
        const res = await self.taskRepo.save(task);
        self._persist();
        return res;
      },
      findById: async (id) => self.taskRepo.findById(id),
      findAll: async () => self.taskRepo.findAll(),
      delete: async (id) => {
        const res = await self.taskRepo.delete(id);
        self._persist();
        return res;
      }
    };
  }

  getCommitmentRepository() {
    const self = this;
    return {
      save: async (comm) => {
        const res = await self.commitmentRepo.save(comm);
        self._persist();
        return res;
      },
      findById: async (id) => self.commitmentRepo.findById(id),
      findByUserId: async (uid) => self.commitmentRepo.findByUserId(uid),
      findAll: async () => self.commitmentRepo.findAll()
    };
  }
}

module.exports = {
  InMemoryTaskRepository,
  InMemoryCommitmentRepository,
  FilePersistenceRepository
};
