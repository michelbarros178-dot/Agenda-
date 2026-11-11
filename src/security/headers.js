/**
 * Capa de Seguridad 1: HTTP Security Headers
 * Implementa una política de defensa en profundidad inspirada en Helmet y recomendaciones OWASP.
 */
function securityHeaders(req, res, next) {
  // Evitar fingerprinting del servidor
  res.removeHeader('X-Powered-By');

  // Prevenir clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Prevenir MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Activar filtro XSS legacy para navegadores compatibles
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Política de referencia estricta
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // HSTS (HTTP Strict Transport Security)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Restringir APIs del navegador no requeridas por la consola
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  // Content Security Policy adaptada para Three.js, Tailwind y Google Fonts
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com https://ajax.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https: ws: wss:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'"
    ].join('; ')
  );

  next();
}

module.exports = securityHeaders;

