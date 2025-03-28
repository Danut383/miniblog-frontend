# frontend/Dockerfile
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Segundo stage para servir contenido
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer puerto
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
