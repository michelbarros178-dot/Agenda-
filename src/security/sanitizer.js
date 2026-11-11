/**
 * Capa de Seguridad 3: Sanitizador contra XSS e inyecciones de contenido
 * Limpia y neutraliza etiquetas peligrosas y payloads en cuerpos y parámetros.
 */
function sanitizeValue(value) {
  if (typeof value === 'string') {
    // Neutralizar tags html peligrosos
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript\s*:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  } else if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  } else if (value !== null && typeof value === 'object') {
    const cleaned = {};
    for (const [k, v] of Object.entries(value)) {
      // Bloquear claves con inyecciones de prototipo
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
      cleaned[k] = sanitizeValue(v);
    }
    return cleaned;
  }
  return value;
}

function inputSanitizer(req, res, next) {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  next();
}

module.exports = {
  sanitizeValue,
  inputSanitizer
};

