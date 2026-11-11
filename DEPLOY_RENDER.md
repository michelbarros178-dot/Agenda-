# 🚀 Guía de Despliegue en Render (Docker) — Chrono·Core 3D Agenda

Esta guía te muestra paso a paso cómo desplegar la aplicación **Chrono·Core** en la nube de **Render.com** utilizando el contenedor Docker optimizado y listo para producción.

---

## 📦 1. Archivos de Configuración Incluidos

El proyecto ya cuenta con toda la infraestructura como código requerida:
* **[Dockerfile](file:///c:/Users/Michel/Downloads/stitch_futuristic_3d_agenda_system/Dockerfile)**: Imagen ultra-ligera basada en `node:20-alpine`, con usuario sin privilegios `node`, variables de entorno de producción y verificación de salud (`HEALTHCHECK`).
* **[.dockerignore](file:///c:/Users/Michel/Downloads/stitch_futuristic_3d_agenda_system/.dockerignore)**: Excluye archivos locales innecesarios (`node_modules`, `.git`, etc.) para una construcción rápida.
* **[render.yaml](file:///c:/Users/Michel/Downloads/stitch_futuristic_3d_agenda_system/render.yaml)**: Blueprint declarativo para despliegue automático con un solo clic.

---

## 🌐 2. Despliegue en Render (Paso a Paso)

### Opción A: Despliegue Automático vía Blueprint (Recomendado)

1. **Sube este proyecto a tu repositorio de GitHub o GitLab**:
   ```bash
   git init
   git add .
   git commit -m "feat: chrono-core docker and render deployment"
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```

2. **Inicia sesión en Render**:
   * Entra a [dashboard.render.com](https://dashboard.render.com).

3. **Crea el servicio desde Blueprint**:
   * Haz clic en el botón **New +** (arriba a la derecha) y selecciona **Blueprint**.
   * Conecta tu repositorio de GitHub.
   * Render leerá automáticamente el archivo `render.yaml` y configurará:
     * Nombre: `chronocore-3d-agenda`
     * Runtime: `Docker`
     * Plan: `Free`
     * Health Check: `/api/health`
   * Haz clic en **Apply**. ¡Render compilará la imagen Docker y te asignará una URL pública con HTTPS (ej. `https://chronocore-3d-agenda.onrender.com`)!

---

### Opción B: Despliegue Manual como Web Service

Si prefieres configurarlo manualmente en la consola de Render:

1. En Render Dashboard, haz clic en **New +** -> **Web Service**.
2. Selecciona **Build and deploy from a Git repository** y conecta tu repositorio.
3. Rellena los siguientes campos:
   * **Name**: `chronocore-agenda` (o el nombre que desees)
   * **Region**: `Oregon (US West)` o la más cercana a ti
   * **Branch**: `main`
   * **Runtime**: Selecciona **Docker**
   * **Instance Type**: **Free**
4. En **Advanced** (Opciones avanzadas):
   * **Health Check Path**: Escribe `/api/health`
5. Haz clic en **Create Web Service**.

> **Nota sobre el puerto**: Render inyecta dinámicamente la variable de entorno `PORT` (usualmente puerto 10000). Nuestro `server.js` ya está programado para detectar `process.env.PORT` y escuchar en todas las interfaces (`0.0.0.0`), por lo que la vinculación es 100% automática.

---

## 💻 3. Cómo Probar el Contenedor Localmente con Docker (Opcional)

Si tienes Docker Desktop instalado en tu equipo y deseas probar la imagen antes de subirla:

```bash
# 1. Construir la imagen Docker
docker build -t chronocore-app .

# 2. Ejecutar el contenedor mapeando el puerto 3000
docker run -p 3000:3000 chronocore-app
```
Luego abre en tu navegador: **`http://localhost:3000`**.
Para verificar el endpoint de salud de Docker:
```bash
curl http://localhost:3000/api/health
```

