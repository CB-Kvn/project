# Usar una imagen base de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de dependencias y luego instalar
COPY package.json package-lock.json ./
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

RUN npm run generate
# Compilar el código TypeScript a JavaScript
RUN npm run build

# Exponer el puerto en el que se ejecutará la API
EXPOSE 3000

# Comando para ejecutar la API
CMD ["node", "dist/server.js"]