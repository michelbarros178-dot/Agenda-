const { TaskValidationException, ScheduleConflictException } = require('../domain/models');
const { audit } = require('./auditLogger');

/**
 * Capa de Seguridad 6: Manejador Centralizado y Seguro de Errores
 * Clasifica excepciones de dominio y oculta trazas de depuración internas.
 */
function errorHandler(err, req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const operatorId = req.operator ? req.operator.operatorId : 'ANONYMOUS';

  // Manejo de Violación de Horarios (RN-03 Schedule Conflict)
  if (err instanceof ScheduleConflictException) {
    audit.log({
      event: 'RN03_SCHEDULE_CONFLICT_DETECTED',
      level: 'WARN',
      ip,
      operatorId,
      method: req.method,
      path: req.originalUrl,
      statusCode: 409,
      details: { error: err.message }
    });

    return res.status(409).json({
      error: 'SCHEDULE_CONFLICT_EXCEPTION',
      rule: 'RN-03',
      message: err.message,
      statusCode: 409
    });
  }

  // Manejo de Validaciones de Dominio (RN-01, RN-02, RN-04, RN-05)
  if (err instanceof TaskValidationException) {
    let rule = 'DOMAIN_RULE';
    if (err.message.includes('RN-01')) rule = 'RN-01';
    else if (err.message.includes('RN-02')) rule = 'RN-02';
    else if (err.message.includes('RN-04')) rule = 'RN-04';
    else if (err.message.includes('RN-05')) rule = 'RN-05';

    audit.log({
      event: `${rule}_VALIDATION_BREACH_REJECTED`,
      level: 'WARN',
      ip,
      operatorId,
      method: req.method,
      path: req.originalUrl,
      statusCode: 400,
      details: { error: err.message, rule }
    });

    return res.status(400).json({
      error: 'TASK_VALIDATION_EXCEPTION',
      rule,
      message: err.message,
      statusCode: 400
    });
  }

  // Error Genérico / Inesperado (Ocultar stack trace para evitar fuga de información sensible)
  audit.log({
    event: 'INTERNAL_SERVER_ERROR',
    level: 'CRITICAL',
    ip,
    operatorId,
    method: req.method,
    path: req.originalUrl,
    statusCode: 500,
    details: { error: err.message }
  });

  console.error('[CRITICAL SECURITY ERROR]:', err);

  return res.status(500).json({
    error: 'INTERNAL_ORBITAL_ERROR',
    message: 'Ha ocurrido una anomalía interna en el subsistema de telemetría.',
    statusCode: 500
  });
}

module.exports = errorHandler;

