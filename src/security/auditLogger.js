/**
 * Capa de Seguridad 5: Registro de Auditoría y Detección de Incidentes
 * Mantiene un buffer en memoria de los últimos eventos y violaciones de seguridad.
 */
class AuditLogger {
  constructor(maxEntries = 200) {
    this.logs = [];
    this.maxEntries = maxEntries;
  }

  log({ event, ip, operatorId, method, path, statusCode = 200, details = null, level = 'INFO' }) {
    const entry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      event,
      level,
      ip: ip || '127.0.0.1',
      operatorId: operatorId || 'ANONYMOUS',
      method,
      path,
      statusCode,
      details
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxEntries) {
      this.logs.pop();
    }
    return entry;
  }

  getRecentLogs(limit = 50) {
    return this.logs.slice(0, limit);
  }

  getSecurityAlerts() {
    return this.logs.filter(l => l.level === 'WARN' || l.level === 'CRITICAL');
  }
}

const auditInstance = new AuditLogger();

// Express middleware para registro automático de transacciones
function auditMiddleware(req, res, next) {
  const startTime = Date.now();
  const originalEnd = res.end;

  res.end = function (...args) {
    res.end = originalEnd;
    res.end.apply(this, args);

    const durationMs = Date.now() - startTime;
    const operatorId = req.operator ? req.operator.operatorId : 'ANONYMOUS';

    let level = 'INFO';
    if (res.statusCode >= 500) level = 'CRITICAL';
    else if (res.statusCode >= 400) level = 'WARN';

    // Registrar solo llamadas a la API
    if (req.path.startsWith('/api')) {
      auditInstance.log({
        event: res.statusCode < 400 ? 'API_TRANSACTION_SUCCESS' : 'API_TRANSACTION_REJECTED',
        level,
        ip: req.ip || req.connection.remoteAddress,
        operatorId,
        method: req.method,
        path: req.originalUrl || req.path,
        statusCode: res.statusCode,
        details: { durationMs }
      });
    }
  };

  next();
}

module.exports = {
  AuditLogger,
  audit: auditInstance,
  auditMiddleware
};

