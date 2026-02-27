# Etapa 1: Construcción
FROM node:20-alpine AS build-stage
WORKDIR /app

# Instalación de dependencias
COPY package.json ./
COPY package-lock.json* ./
RUN npm install

# Construcción de la App (Vite genera 'dist')
COPY . .
RUN npm run build

# Etapa 2: Servidor de Producción (Nginx)
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# IMPORTANTE: Vite usa 'dist'. El error occurre si buscas 'build'.
COPY --from=build-stage /app/dist .

# Configuración de Nginx para SPA (Evita el error 404 al recargar)
RUN echo 'server { \
    listen 80; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

# Exponemos el puerto interno del contenedor
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]