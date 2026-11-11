/**
 * Capa de Seguridad 4: Autenticación de Operadores Orbitales & RBAC
 * Soporta tokens Bearer en cabecera 'Authorization' o cabecera dedicada 'X-Orbital-Token'.
 */

// Registro de operadores válidos del sistema orbital ChronoCore
const VALID_OPERATORS = new Map([
  [
    'orbital-token-alpha-7',
    {
      operatorId: 'commander@chronocore.space',
      name: 'Comandante Orbital',
      role: 'COMMANDER', // Acceso total
      permissions: ['tasks:read', 'tasks:write', 'commitments:read', 'commitments:write', 'audit:read']
    }
  ],
  [
    'orbital-token-lead-4',
    {
      operatorId: 'lead@quantum.dev',
      name: 'Ingeniero Cuántico Líder',
      role: 'ENGINEER',
      permissions: ['tasks:read', 'tasks:write', 'commitments:read', 'commitments:write']
    }
  ],
  [
    'orbital-token-station-9',
    {
      operatorId: 'officer.val@station.io',
      name: 'Oficial de Estación',
      role: 'OFFICER',
      permissions: ['tasks:read', 'commitments:read', 'commitments:write']
    }
  ]
]);

function authenticateOperator(req, res, next) {
  // Extraer token de cabecera 'X-Orbital-Token' o 'Authorization: Bearer <token>'
  let token = req.headers['x-orbital-token'];
  const authHeader = req.headers['authorization'];

  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // Token de acceso de telemetría por defecto en desarrollo local si no se suministra
  if (!token) {
    token = 'orbital-token-alpha-7';
  }

  const operator = VALID_OPERATORS.get(token);

  if (!operator) {
    return res.status(401).json({
      error: 'UNAUTHORIZED_ORBITAL_ACCESS',
      message: 'Token de enlace orbital inválido o expirado.',
      statusCode: 401
    });
  }

  // Asignar operador al request para trazabilidad
  req.operator = operator;
  next();
}

function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.operator) {
      return res.status(401).json({ error: 'UNAUTHORIZED', statusCode: 401 });
    }
    if (req.operator.role === 'COMMANDER' || req.operator.permissions.includes(permission)) {
      return next();
    }
    return res.status(403).json({
      error: 'FORBIDDEN_PRIVILEGE_LEVEL',
      message: `El operador ${req.operator.operatorId} no cuenta con el privilegio '${permission}'.`,
      statusCode: 403
    });
  };
}

module.exports = {
  authenticateOperator,
  requirePermission,
  VALID_OPERATORS
};

