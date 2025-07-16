# Dockerfile.dev
FROM node:20-alpine

# Instala dependencias esenciales
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copia el resto del proyecto (aunque luego lo sobrescribimos con volumen)
COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
