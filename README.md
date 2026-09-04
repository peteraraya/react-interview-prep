<div align="center">

# 🚀 React Interview Prep

### 📚 Proyecto de Aprendizaje Interactivo para Entrevistas Técnicas de React

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

**✨ Un laboratorio interactivo con 16 módulos para dominar React desde cero hasta patrones avanzados. Cada módulo incluye ejemplos documentados, desafíos de entrevista y preguntas/respuestas para practicar en voz alta.**

</div>

---

## 🎯 Objetivo

> Esto es un **repositorio con fines educativos y de reforzamiento**. Está diseñado para que **tú** construyas una base sólida de React estudiando de forma activa y práctica, no solo leyendo teoría.

Cada módulo te guía en **3 pasos**:
1. 📖 **Aprende** los conceptos con ejemplos comentados.
2. 🛠️ **Practica** resolviendo un desafío de entrevista real.
3. 🗣️ **Verbaliza** las respuestas que darías en una entrevista.

---

## ⚡ Inicio Rápido

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/react-interview-prep.git

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# → http://localhost:5173
```

> 💡 **Tip:** usá `npm run build` para generar la versión de producción y `npm run preview` para previsualizarla.

---

## 📁 Estructura del Proyecto

```
📦 react-interview-prep
 ┣ 📂 src/
 ┃ ┣ 📂 01-jsx/           🔹 JSX fundamentals
 ┃ ┣ 📂 02-props/         🔹 Props y componentes
 ┃ ┣ 📂 03-state/         🔹 Estado local
 ┃ ┣ 📂 04-hooks/         🔹 Hooks de React
 ┃ ┣ 📂 05-lifecycle/     🔹 Ciclo de vida
 ┃ ┣ 📂 06-api/           🔹 Data fetching
 ┃ ┣ 📂 07-context/       🔹 Context API
 ┃ ┣ 📂 08-zustand/       🔹 Zustand state management
 ┃ ┣ 📂 09-forms-zod/     🔹 Formularios + Zod
 ┃ ┣ 📂 10-react-query/   🔹 TanStack Query
 ┃ ┣ 📂 11-testing/       🔹 Jest + RTL
 ┃ ┣ 📂 12-typescript/    🔹 TypeScript en React
 ┃ ┣ 📂 13-router/        🔹 React Router
 ┃ ┣ 📂 14-performance/   🔹 Optimización de rendimiento
 ┃ ┣ 📂 15-custom-hooks/  🔹 Custom Hooks avanzados
 ┃ ┣ 📂 16-patterns/      🔹 Patrones avanzados
 ┃ ┣ 📂 qa-ui/            🔹 Componentes reutilizables (preguntas + visor de código)
 ┃ ┣ 📄 App.jsx           🔹 Componente principal
 ┃ ┗ 📄 main.jsx          🔹 Punto de entrada
 ┣ 📄 package.json
 ┣ 📄 vite.config.js
 ┣ 🐳 Dockerfile          🔹 Build de producción multi-stage
 ┣ 🐳 nginx.conf          🔹 Configuración de nginx (SPA)
 ┣ 🐳 docker-compose.yml  🔹 Entorno de producción
 ┣ 🐳 docker-compose.dev.yml 🔹 Entorno de desarrollo
 ┗ 📄 README.md
```

### 📦 Cada módulo contiene 3 archivos

| Archivo | Propósito |
|---------|-----------|
| `Example.jsx` ✏️ | Ejemplos documentados y explicación de conceptos |
| `Challenge.jsx` 🎯 | Ejercicio de entrevista + solución + desglose |
| `preguntas.jsx` 🗣️ | Preguntas frecuentes con las **respuestas recomendadas** |

> 🗂️ La aplicación tiene **3 pestañas** por módulo: *Ejemplo Educativo*, *Desafío de Entrevista* y *Preguntas de Entrevista*.

### 💻 Visor de código fuente

Cada lección tiene un botón flotante **"💻 Ver código"** (abajo a la derecha) que abre un panel lateral con el código fuente real de la lección activa.

- 🔀 Cambia entre `Example.jsx`, `Challenge.jsx` y `preguntas.jsx` con las pestañas del panel.
- 📋 Botón *Copiar* para copiar el código al portapapeles.
- 🔢 Numeración de líneas y scroll para leer el archivo completo.
- ✅ Se implementa con `import.meta.glob + ?raw` de Vite (**sin dependencias externas**).

---

## 🧠 Módulos de Aprendizaje

### 🔹 Fundamentos (Módulos 01-06)

| # | Módulo | Conceptos | Desafío |
|---|--------|-----------|---------|
| 01 | **JSX** | Sintaxis, expresiones, renderizado condicional, listas | Lista de usuarios con filtros |
| 02 | **Props** | Paso de datos, children, callbacks, valores por defecto | Sistema de tarjetas reutilizable |
| 03 | **Estado** | useState, inmutabilidad, formularios controlados | Carrito con localStorage |
| 04 | **Hooks** | useEffect, useRef, useMemo, useCallback | Buscador con debounce/cache |
| 05 | **Ciclo de Vida** | Montaje, desmontaje, limpieza de recursos | Chat en tiempo real |
| 06 | **API** | Fetch, async/await, paginación, CRUD | App de clima con geolocalización |

### 🔷 Avanzado / Librerías (Módulos 07-16)

| # | Módulo | Conceptos | Desafío |
|---|--------|-----------|---------|
| 07 | **Context API** | createContext, Provider, useContext, useReducer | Carrito global con Context |
| 08 | **Zustand** | Store, selectores, middleware, persist | Gestor de tareas avanzado |
| 09 | **Forms + Zod** | react-hook-form, validación, field arrays | Registro multi-paso de empresa |
| 10 | **React Query** | useQuery, useMutation, caché, optimistic updates | Tabla CRUD con paginación |
| 11 | **Testing** | Jest, RTL, queries, mocks, assertions | Tests para Shopping Cart |
| 12 | **TypeScript** | Interfaces, generics, tipos, assertions | Sistema de usuarios tipado |
| 13 | **React Router** | Routes, useParams, useNavigate, rutas protegidas | Dashboard con autenticación |
| 14 | **Performance** | React.memo, useMemo, useCallback, lazy loading | Lista optimizada de 10k items |
| 15 | **Custom Hooks** | useLocalStorage, useFetch, useDebounce, composición | Hook usePagination completo |
| 16 | **Patrones** | Error Boundaries, HOC, render props, compound | Sistema de notificaciones |

---

## 🗓️ Guía de Estudio Recomendada

### Fase 1 - Fundamentos 🟢 *(2-3 semanas)*
- **Semana 1:** Módulos 01-02 (JSX y Props)
- **Semana 2:** Módulo 03 (Estado)
- **Semana 3:** Módulos 04-06 (Hooks, Ciclo de Vida, API)

### Fase 2 - Avanzado 🟡 *(2-3 semanas)*
- **Semana 4:** Módulos 07-08 (Context y Zustand)
- **Semana 5:** Módulo 09 (Formularios)
- **Semana 6:** Módulos 10-11 (React Query y Testing)

### Fase 3 - Especialización 🔴 *(2-3 semanas)*
- **Semana 7:** Módulo 12 (TypeScript)
- **Semana 8:** Módulos 13-14 (Router y Performance)
- **Semana 9:** Módulos 15-16 (Custom Hooks y Patrones)

### ✅ Flujo de trabajo por módulo

1. 📖 **Leer el `Example.jsx`** — entender los conceptos con ejemplos comentados.
2. 🔍 **Estudiar la documentación** — revisar la sección de explicación.
3. 🎯 **Intentar el `Challenge.jsx`** — resolverlo sin mirar la solución.
4. 📝 **Comparar con la solución** — analizar las diferencias con tu implementación.
5. 🗣️ **Practicar la pestaña "Preguntas"** — decir en voz alta las respuestas recomendadas.

> 💡 **Método activo:** cubrí las respuestas y tratá de explicarlas con tus propias palabras antes de destaparlas. Esto es lo que te va a preparar de verdad para la entrevista.

---

## 🔧 Comandos Útiles

```bash
npm install          # 📦 Instalar dependencias
npm run dev          # 🚀 Iniciar servidor de desarrollo
npm run build        # 🏗️ Generar build de producción
npm run preview      # 👀 Previsualizar el build
```

---

## 🐳 Dockerización (Configuración Profesional)

El proyecto está dockerizado de forma **profesional** con un enfoque de **multi-stage build** para producción y un entorno dedicado para desarrollo con *hot-reload*.

### 📦 Archivos incluidos

| Archivo | Propósito |
|---------|-----------|
| `Dockerfile` | Build multi-stage: compila con Node → sirve con nginx |
| `nginx.conf` | Configuración de nginx (SPA fallback, gzip, caché, seguridad) |
| `docker-compose.yml` | Entorno de **producción** (nginx) |
| `docker-compose.dev.yml` | Entorno de **desarrollo** (hot-reload de Vite) |
| `.dockerignore` | Excluye archivos innecesarios del contexto de build |

### 🏗️ Cómo funciona el `Dockerfile`

El `Dockerfile` usa **2 etapas** para producir una imagen mínima y segura:

```
🧱 ETAPA 1 (build)                 🚀 ETAPA 2 (runtime)
┌──────────────────────┐           ┌─────────────────────────┐
│ node:20-alpine       │           │ nginx:1.27-alpine       │
│  ├─ npm ci           │  ──►      │  ├─ nginx.conf          │
│  ├─ npm run build    │  copia    │  ├─ /dist → html        │
│  └─ genera /dist     │  dist     │  └─ sirve en :80        │
└──────────────────────┘           └─────────────────────────┘
```

**Beneficios:**
- 🪶 Imagen final más liviana (solo nginx + HTML/JS/CSS, **sin Node**).
- 🔒 Menor superficie de ataque (menos paquetes instalados).
- ⚡ Aprovecha la caché de capas (solo reinstala si cambia `package.json`).
- ✅ Incluye `HEALTHCHECK` para monitoreo del contenedor.

### 🚀 Ejecutar en PRODUCCIÓN

```bash
# 1. Construir y levantar el contenedor
docker compose up -d --build

# 2. Verificar que esté corriendo
docker compose ps

# 3. Abrir en el navegador
# → http://localhost:8080

# 4. Ver los logs en tiempo real
docker compose logs -f
```

### 🧑‍💻 Ejecutar en DESARROLLO (con hot-reload)

```bash
# Levantar el entorno de desarrollo
docker compose -f docker-compose.dev.yml up

# → http://localhost:5173 (refresca solo con cada cambio)
```

> 💡 En Windows/Docker: el entorno de desarrollo usa `CHOKIDAR_USEPOLLING=true` para que el hot-reload funcione correctamente con los montajes de volúmenes.

### 🧹 Gestionar los contenedores

```bash
# Detener sin eliminar
docker compose down

# Detener y eliminar todo (con volúmenes)
docker compose down -v

# Detener el entorno de desarrollo
docker compose -f docker-compose.dev.yml down

# Ver imágenes construidas
docker images

# Entrar a un contenedor en ejecución
docker exec -it <container-name> sh
```

### 🔄 Workflow de tags / releases

```bash
# Construir con un tag específico (versión)
docker build -t react-interview-prep:1.0.0 .

# Levantar con una versión concreta
docker run -d -p 8080:80 react-interview-prep:1.0.0

# Subir a un registry (Docker Hub / GHCR)
docker tag react-interview-prep:1.0.0 tu-usuario/react-interview-prep:1.0.0
docker push tu-usuario/react-interview-prep:1.0.0
```

> ⚠️ **Nota:** Docker Desktop debe estar encendido para que estos comandos funcionen.

---

## 🌿 Flujo de Trabajo con Git (Git Flow simplificado)

El repositorio usa una rama `main` (estable) y una rama `develop` (integración).

### 🔀 Ramas del proyecto

- `main` — Código estable y listo para producción/deploy.
- `develop` — Rama de desarrollo donde se integran features nuevas.

### ✅ Primeros pasos (ya configurado)

```bash
# Ver ramas locales
git branch

# Cambiar a la rama develop para trabajar
git checkout develop
```

### 🔧 Workflow diario

```bash
# 1. Asegúrate de estar en develop
git checkout develop

# 2. Crear una rama para tu feature (desde la última develop)
git pull origin develop
git checkout -b feature/nombre-tu-feature

# 3. Trabajar, agregar y commitear
git add .
git commit -m "feat: descripción del cambio"

# 4. Volver a develop e integrar tu feature
git checkout develop
git merge feature/nombre-tu-feature

# 5. Publicar develop en GitHub
git push origin develop
```

### 🎯 Merge a producción (release)

Cuando el código de `develop` ya está probado y estable:

```bash
git checkout main
git pull origin main
git merge develop
git push origin main
```

> 📌 **Recomendación profesional:** Para un flujo completo, protegé la rama `main` en GitHub (Settings → Branches → Add rule) para que los merge a producción requieran *Pull Request + code review*, y activá branch protection en `develop` si trabajás en equipo.

### 📝 Convención de commits

| Tipo | Ejemplo | Uso |
|------|---------|-----|
| `feat` | `feat: agregar modulo de tipos` | Nueva funcionalidad |
| `fix` | `fix: corregir bug en formulario` | Corrección de bugs |
| `docs` | `docs: actualizar README` | Cambios de documentación |
| `refactor` | `refactor: mejorar componente` | Refactorización sin cambiar comportamiento |
| `chore` | `chore: actualizar dependencias` | Tareas de mantenimiento |
| `style` | `style: aplicar formato` | Cambios de formato/estilo |

---

## 🛠️ Tecnologías Utilizadas

### Core
- ⚛️ **React 18** — Librería de interfaces de usuario
- ⚡ **Vite** — Bundler de desarrollo ultrarrápido
- 🟨 **JavaScript ES6+** — Lenguaje base
- 🔷 **TypeScript** — Tipado estático (configurado)

### Librerías
- 🐻 **Zustand** — State management
- 🔄 **TanStack Query** — Estado del servidor / caché
- 📝 **React Hook Form** — Formularios
- ✅ **Zod** — Validación de esquemas
- 🧭 **React Router** — Navegación SPA

### Testing
- 🧪 **Jest** — Test runner
- 🎭 **React Testing Library** — Testing de componentes

---

## 📚 Recursos Adicionales

- 📖 [Documentación oficial de React](https://react.dev/)
- 🐻 [Zustand](https://github.com/pmndrs/zustand)
- 🔄 [TanStack Query](https://tanstack.com/query)
- 📝 [React Hook Form](https://react-hook-form.com/)
- ✅ [Zod](https://zod.dev/)
- 🎭 [Testing Library](https://testing-library.com/)

---

## 🧑‍💻 Contribuir

Este es un proyecto de **aprendizaje personal**, pero si encontrás errores, mejoras o querés agregar un módulo nuevo, ¡tu contribución es bienvenida! Abrí un *issue* o enviá un *pull request*.

---

<div align="center">

**Hecho con ❤️ con fines de aprendizaje y reforzamiento de React.**

Desarrollado por [**@peterarayan**](https://pedroaraya.vercel.app/) — 

⭐ Si te resultó útil este proyecto, ¡dale una estrella! ⭐

</div>
