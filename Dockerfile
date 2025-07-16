# Etapa 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copia manifestos de dependencias
COPY package*.json ./

# Instala dependencias ignorando peers conflictivos
RUN npm install --legacy-peer-deps

# Copia el resto y compila
COPY . .
RUN npm run build

# Etapa 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# (Opcional) COPY --from=build /app/.env ./

EXPOSE 3000
CMD ["node", "dist/main"]
