# =============================================================
#  PRODUCCIÓN - Build multi-stage (recomendado para deploy)
#  Imagen final: nginx sirviendo el build estático de Vite
# =============================================================

# ---------- ETAPA 1: Build ----------
FROM node:20-alpine AS build

# Directorio de trabajo
WORKDIR /app

# Copiar primero SOLO el package.json y lockfile para aprovechar la caché de capas
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Compilar la aplicación de producción
RUN npm run build

# ---------- ETAPA 2: Servir con nginx ----------
FROM nginx:1.27-alpine AS runtime

# Copiar configuración personalizada (SPA fallback, gzip, caché)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el build generado en la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Puerto expuesto (HTTP)
EXPOSE 80

# Healthcheck básico
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1

# nginx corre en foreground
CMD ["nginx", "-g", "daemon off;"]
