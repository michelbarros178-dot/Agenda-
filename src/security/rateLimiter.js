/**
 * Capa de Seguridad 2: Rate Limiter (Protección Anti-DDoS y Fuerza Bruta)
 * Control de frecuencia basado en ventana deslizante por dirección IP.
 */
function createRateLimiter({ windowMs = 60000, max = 100, message = 'Límite de solicitudes excedido.' } = {}) {
  const requests = new Map();

  // Limpieza periódica cada 2 minutos
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of requests.entries()) {
      const active = timestamps.filter(t => now - t < windowMs);
      if (active.length === 0) {
        requests.delete(ip);
      } else {
        requests.set(ip, active);
      }
    }
  }, 120000).unref();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const now = Date.now();

    const clientTimestamps = requests.get(ip) || [];
    const validTimestamps = clientTimestamps.filter(t => now - t < windowMs);

    if (validTimestamps.length >= max) {
      const oldest = validTimestamps[0];
      const retryAfterSeconds = Math.ceil((windowMs - (now - oldest)) / 1000);

      res.setHeader('Retry-After', retryAfterSeconds);
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', Math.ceil((oldest + windowMs) / 1000));

      return res.status(429).json({
        error: 'RATE_LIMIT_EXCEEDED',
        message,
        retryAfterSeconds,
        statusCode: 429
      });
    }

    validTimestamps.push(now);
    requests.set(ip, validTimestamps);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', max - validTimestamps.length);

    next();
  };
}

module.exports = {
  apiLimiter: createRateLimiter({ windowMs: 60 * 1000, max: 150, message: 'Demasiadas peticiones al subsistema de telemetría.' }),
  mutationLimiter: createRateLimiter({ windowMs: 60 * 1000, max: 40, message: 'Frecuencia de creación/mutación excedida.' })
};

