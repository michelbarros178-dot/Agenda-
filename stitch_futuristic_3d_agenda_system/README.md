# 🌌 CHRONO·CORE — Futuristic 3D Agenda & Security Defense System

<div align="center">

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-v20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r128-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deployable-46E3B7?style=for-the-badge&logo=render&logoColor=black)
![Tests](https://img.shields.io/badge/Tests-12%2F12%20Passing-success?style=for-the-badge)

<p align="center">
  <b>Sistema de comando orbital y gestión de agenda cuántica en tiempo real con estética ciberespacial Aether Void, arquitectura limpia (Clean Architecture), backend blindado con defensa en profundidad (Defense-in-Depth) y contenedor Docker listo para producción en Render.</b>
</p>

[Demostración](#-guía-rápida-de-inicio) • [Arquitectura](#-arquitectura-del-software) • [Capas de Seguridad](#-capas-de-seguridad-en-profundidad) • [Reglas de Negocio](#-reglas-de-negocio-sdd) • [API REST](#-referencia-de-la-api-rest) • [Despliegue en Render](#-despliegue-en-la-nube-render)

</div>

---

## 🌟 Características Principales

* **🌌 Núcleo Cuántico 3D Interactivo (Three.js)**:
  * Visualización tridimensional en tiempo real con campo de estrellas procedural, anillos de confinamiento magnético, nodos orbitales y paralaje reactivo al puntero del mouse.
* **📅 Calendario Cuántico Multifásico**:
  * Vista de cuadrícula semanal y selector de zoom diario a intervalos de **5 minutos** para planificación de alta precisión.
  * Análisis de densidad horaria y detección inmediata de conflictos en matriz.
* **📋 Gestor de Tareas Temporales (Task Service)**:
  * Control del ciclo de vida de tareas: `PENDIENTE` ➔ `EN_PROCESO` ➔ `COMPLETADA` / `CANCELADA`.
  * Filtro por estados y blindaje de inmutabilidad terminal (**RN-02**).
* **⏱️ Radar Gantt de Compromisos & Traslapes (Commitment Service)**:
  * Radar horizontal con **cuadrícula cuántica**, carriles dinámicos escalonados para evitar solapamientos visuales y visualización precisa de rangos horarios (`HH:mm UTC`).
  * Validación estricta contra solapamientos de horario (**RN-03**), duración mínima de 15 minutos (**RN-04**) y validación de correos de participantes bajo estándar RFC 5322 (**RN-05**).
* **🛡️ Arquitectura de Seguridad en Profundidad (Defense-in-Depth)**:
  * 6 capas activas: Cabeceras HTTP blindadas (CSP/HSTS/NoSniff), Rate Limiting deslizante, Sanitizador recursivo Anti-XSS, Autenticación RBAC con Tokens orbitales, Auditoría inmutable de eventos y Manejo seguro de errores.
* **🧪 Suite de Pruebas Automatizadas Integrada**:
  * 12 pruebas unitarias con el ejecutor nativo de Node.js (`node --test`), con interfaz visual interactiva en el cliente web.
* **🐳 Dockerizado & Despliegue en 1 Clic**:
  * `Dockerfile` basado en `node:20-alpine`, `render.yaml` declarativo y compatibilidad con Render Cloud.

---

## 🏛️ Arquitectura del Software

El proyecto implementa los principios de **Clean Architecture** (Arquitectura Limpia) y diseño guiado por el dominio (DDD), desacoplando la lógica de negocio de los detalles de infraestructura:

```
stitch_futuristic_3d_agenda_system/
├── Dockerfile                   # Imagen Docker ligera de producción (node:20-alpine)
├── .dockerignore                # Optimización del contexto de construcción Docker
├── render.yaml                  # Blueprint de infraestructura para Render Cloud
├── server.js                    # Servidor Express.js con API REST y capas de seguridad
├── index.html                   # Interfaz HUD 3D Aether Void (Three.js + Tailwind + ES6)
├── package.json                 # Dependencias y scripts de ejecución
├── start.bat                    # Lanzador rápido de 1 solo clic para Windows
├── DEPLOY_RENDER.md             # Guía paso a paso de despliegue en Render
├── tests/
│   └── AgendaSuite.test.js      # Suite de 12 pruebas unitarias y de seguridad
└── src/
    ├── domain/
    │   └── models.js            # Entidades Task y Commitment, Enums y Excepciones
    ├── infrastructure/
    │   └── repositories.js      # Repositorios en memoria y persistencia en archivo JSON
    ├── application/
    │   └── services.js          # TaskService y CommitmentService (Enforcement de reglas)
    └── security/
        ├── headers.js           # Cabeceras HTTP (Helmet-equivalent: CSP, HSTS, NoSniff)
        ├── rateLimiter.js       # Rate Limiting por ventana deslizante (HTTP 429)
        ├── sanitizer.js         # Sanitización recursiva Anti-XSS y de inyecciones
        ├── auth.js              # Autenticación Bearer Token y control RBAC
        ├── auditLogger.js       # Registro cronológico inmutable de auditoría
        └── errorHandler.js      # Manejador centralizado sin fuga de trazas de pila
```

---

## 🛡️ Capas de Seguridad en Profundidad

| Capa de Seguridad | Componente | Mecanismo de Defensa |
|---|---|---|
| **1. Cabeceras HTTP** | `src/security/headers.js` | CSP estricto (restringe scripts a fuentes seguras), `Strict-Transport-Security` (HSTS), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN` (anti-clickjacking). |
| **2. Rate Limiting** | `src/security/rateLimiter.js` | Ventana deslizante en memoria: 150 peticiones/minuto por IP para lectura, 40 peticiones/minuto para mutaciones (`POST`/`PUT`/`DELETE`). Responde con HTTP `429 Too Many Requests` y cabecera `Retry-After`. |
| **3. Sanitización Anti-XSS**| `src/security/sanitizer.js` | Inspección recursiva de payloads JSON, parámetros de URL y queries. Neutraliza etiquetas `<script>`, pseudo-protocolos `javascript:` y controladores de eventos (`onload`, `onerror`). |
| **4. Autenticación & RBAC** | `src/security/auth.js` | Autenticación mediante `Authorization: Bearer <TOKEN>` o `X-Orbital-Token`. Validación estricta de roles (`COMMANDER`, `LEAD`, `OPERATOR`). |
| **5. Auditoría en Tiempo Real**| `src/security/auditLogger.js`| Registro cronológico de transacciones, accesos no autorizados y transgresiones de reglas. Consultable en `/api/security/audit-logs`. |
| **6. Manejador de Errores** | `src/security/errorHandler.js`| Respuestas controladas con códigos HTTP canónicos (`400`, `401`, `403`, `404`, `409`, `429`). Suprime trazas internas de pila en producción. |

### 🔑 Operadores y Tokens Preconfigurados

| Identificador / Token | Rol Orbital | Nivel de Privilegios |
|---|---|---|
| `commander@chronocore.space` | `COMMANDER` | Nivel 3 (Acceso total, auditoría, mutaciones) |
| `lead@quantum.dev` | `LEAD` | Nivel 2 (Gestión de tareas y compromisos) |
| `officer.val@station.io` | `OPERATOR` | Nivel 1 (Operación estándar y lectura) |

---

## ⚖️ Reglas de Negocio (SDD)

El sistema valida formalmente las siguientes reglas de dominio antes de admitir cualquier cambio de estado o persistencia:

* **`RN-01` (Vencimiento Futuro de Tareas)**: La fecha de vencimiento debe ser igual o superior al momento exacto de su creación (`fechaVencimiento >= now`). De lo contrario, lanza `TaskValidationException`.
* **`RN-02` (Inmutabilidad Terminal)**: Una tarea en estado `COMPLETADA` o `CANCELADA` no puede reactivarse a `PENDIENTE` o `EN_PROCESO`.
* **`RN-03` (Detección Estricta de Traslapes)**: Un compromiso colisiona si:
  $$\text{Existe Conflicto} \iff (\text{NuevoInicio} < \text{ExistenteFin}) \land (\text{NuevoFin} > \text{ExistenteInicio})$$
  * Los compromisos contiguos (`Fin == SiguienteInicio`) están explícitamente permitidos.
  * Los compromisos en estado `CANCELADO` son excluidos de la detección de conflicto.
* **`RN-04` (Duración Mínima)**: Todo compromiso debe tener una duración mínima obligatoria de **15 minutos** (`fechaFin - fechaInicio >= 15 min`).
* **`RN-05` (Validación de Participantes)**: Cada participante debe ser un correo electrónico válido conforme a la especificación estándar **RFC 5322**.

---

## 📡 Referencia de la API REST

### Tareas (`/api/tasks`)
* `GET /api/tasks` — Listar tareas activas (permite filtro `?status=...`).
* `POST /api/tasks` — Crear nueva tarea (valida **RN-01**).
* `PATCH /api/tasks/:id/status` — Actualizar estado (valida **RN-02**).
* `DELETE /api/tasks/:id` — Eliminar tarea.

### Compromisos (`/api/commitments`)
* `GET /api/commitments` — Listar todos los compromisos.
* `POST /api/commitments` — Agendar nuevo compromiso (valida **RN-03**, **RN-04**, **RN-05**).
* `PATCH /api/commitments/:id/cancel` — Cancelar compromiso (libera el bloque horario).
* `POST /api/commitments/check-conflict` — Evaluar conflicto sin persistir.

### Sistema y Auditoría
* `GET /api/health` — Chequeo de salud del servicio, métricas de memoria y estado de escudos.
* `GET /api/security/audit-logs` — Registro de auditoría (requiere rol `LEAD` o `COMMANDER`).
* `POST /api/tests/run` — Ejecución de la suite de pruebas bajo demanda.

---

## 🧪 Suite de Pruebas Automatizadas

El proyecto cuenta con una batería de **12 pruebas unitarias y de integración** que validan al 100% las reglas de negocio y las capas de seguridad:

```bash
npm test
```

Salida esperada:
```text
▶ Suite de Pruebas SDD & Capas de Seguridad ChronoCore
  ✔ RN-01: Debe fallar al crear una tarea con vencimiento en el pasado
  ✔ RN-01: Debe permitir crear tarea con fecha presente o futura
  ✔ RN-02: No debe permitir que COMPLETADA cambie a EN_PROCESO ni a PENDIENTE
  ✔ RN-02: No debe permitir que CANCELADA cambie a EN_PROCESO o PENDIENTE
  ✔ RN-04: Caso límite: exactamente 15 minutos debe ser aceptado
  ✔ RN-04: Duración menor a 15 minutos (14m 59s) debe lanzar excepción
  ✔ RN-05: Debe fallar si cualquier correo de participante es inválido según RFC 5322
  ✔ RN-03: Detección estricta de traslapes en compromisos
  ✔ RN-03: Un compromiso CANCELADO no debe generar conflicto
  ✔ SEGURIDAD: Sanitizador neutraliza scripts maliciosos y eventos XSS
  ✔ SEGURIDAD: Tokens de operadores orbitales y control RBAC configurados
✔ Suite de Pruebas SDD & Capas de Seguridad ChronoCore (12/12 passing)
```

---

## 💻 Guía Rápida de Inicio

### Requisitos Previos
* [Node.js](https://nodejs.org/) v18 o superior (v20+ recomendado).
* [Git](https://git-scm.com/).
* (Opcional) [Docker Desktop](https://www.docker.com/).

### Opción 1: En Windows con un solo clic
Haz doble clic sobre el archivo **`start.bat`** en la raíz del proyecto. Este script iniciará el servidor Node.js y abrirá automáticamente tu navegador en `http://localhost:3000`.

### Opción 2: Ejecución estándar con Node.js
```bash
# 1. Clonar el repositorio
git clone https://github.com/michelbarros178-dot/Agenda-.git
cd Agenda-

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor
npm start
```
Abre tu navegador en: **`http://localhost:3000`**

### Opción 3: Ejecución con Docker Local
```bash
# Construir la imagen Docker
docker build -t chronocore-app .

# Correr el contenedor
docker run -p 3000:3000 chronocore-app
```

---

## ☁️ Despliegue en la Nube (Render)

La aplicación está lista para desplegarse de inmediato en **Render.com** gracias al archivo `render.yaml` incluido:

1. Entra a tu cuenta en **[dashboard.render.com](https://dashboard.render.com)**.
2. Haz clic en **New +** y selecciona **Blueprint**.
3. Conecta el repositorio: `https://github.com/michelbarros178-dot/Agenda-.git`.
4. Render detectará automáticamente el archivo `render.yaml`, compilará la imagen Docker y publicará tu aplicación con **HTTPS gratuito**.

*(Para instrucciones detalladas paso a paso, consulta [DEPLOY_RENDER.md](DEPLOY_RENDER.md)).*

---

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE). Libre para uso educativo, comercial o de desarrollo espacial.
