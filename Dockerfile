# Multi-stage lightweight production Dockerfile
FROM node:20-alpine

# Metadata
LABEL maintainer="ChronoCore Orbital Systems"
LABEL description="Chrono·Core - Futuristic 3D Agenda & Security Defense System"

# Variables de entorno de producción
ENV NODE_ENV=production
ENV PORT=3000

# Directorio de trabajo
WORKDIR /app

# Copia de manifiestos para aprovechar el caché de capas Docker
COPY package*.json ./

# Instalación limpia de dependencias de producción
RUN npm ci --omit=dev --no-audit --no-fund

# Copia de la estructura de código fuente y activos
COPY server.js ./
COPY index.html ./
COPY src/ ./src/

# Creación de directorio para persistencia de datos y asignación de permisos
RUN mkdir -p /app/.data && chown -R node:node /app

# Cambio al usuario no-root por seguridad (Principle of Least Privilege)
USER node

# Exposición del puerto asignado
EXPOSE 3000

# Verificación de salud (Health Check) compatible con Render y Docker
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${PORT}/api/health || exit 1

# Comando de arranque del servidor
CMD ["node", "server.js"]

