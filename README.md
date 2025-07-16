# API de Productos - NestJS

Este proyecto presenta una **API RESTful de alto rendimiento** dedicada a la **administración de productos**. Construida sobre el potente framework **NestJS**, garantiza una interacción eficiente con los datos a través de **TypeORM** y **PostgreSQL**. Destaca por su enfoque **Docker**, permitiendo que tanto el servicio de la API como la base de datos se ejecuten en entornos completamente aislados y portátiles, ideal para un desarrollo y despliegue ágiles.

## Características

- **CRUD completo** para entidad de productos
- **Configuración con variables de entorno**
- **Validaciones robustas** con DTOs y class-validator
- **Manejo de excepciones** personalizado de manera global
- **Base de datos PostgreSQL** con TypeORM
- **Pruebas unitarias** con Jest
- **Logging** de requests y responses
- **CORS** habilitado
- **Docker** para la api y para la base de datos

## Requisitos

- Node.js (v18 o superior)
- Docker y Docker Compose
- npm 
- Docker (PostgreSQL y Node.js)

## Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/alejandrorndev/prueba-backend-homepower.git
cd prueba-backend-homepower
```

### 2. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=nest
DB_PASSWORD=nest
DB_NAME=testdb
PORT=5000
NODE_ENV=development

```

### 3. Iniciar los contenedores con Docker
```bash
docker compose build
docker compose up -d
```

### 4. Ejecutar la aplicación
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```
# Esquema de la Base de Datos

### Entidad Producto
```typescript
{
  id: string (UUID, Primary Key)
  nombre: string (máximo 255 caracteres)
  precio: number (decimal con 3 decimales)
  stock: number (entero, mínimo 0)
  created_at: Date
  updated_at: Date
}
```

##  Endpoints de la API

### URL local
```
http://localhost:5000
```

### Productos

#### Crear producto
```http
POST /productos
Content-Type: application/json

{
  "nombre": "Teclado Mecánico",
  "precio": 100.980,
  "stock": 15
}
```

#### Obtener todos los productos
```http
GET /productos
```

#### Obtener producto por ID
```http
GET /productos/porid/{id}
```

#### Actualizar producto
```http
PATCH /productos/{id}
Content-Type: application/json

{
  "nombre": "Cambio nombre",
  "precio": 149.99,
  "stock": 100
}
```

#### Eliminar producto
```http
DELETE /productos/{id}
```
## Herramientas Recomendadas

- **Postman**: Para pruebas interactivas de la API

## Validaciones

### CreateProductoDto
- **nombre**: Requerido, string, máximo 255 caracteres
- **precio**: Requerido, número positivo con máximo 3 decimales
- **stock**: Requerido, número entero no negativo

### UpdateProductoDto
- Todos los campos son opcionales
- Mismas validaciones que CreateProductoDto cuando se proporcionan

## Pruebas

### Ejecutar todas las pruebas
```bash
npm run test
```

# Ejemplos de Uso de la API

## Configuración inicial

Asegúrate de que la aplicación esté corriendo `http://localhost:5000`

## Ejemplos con CURL

### 1. Crear un producto
```bash
curl -X POST http://localhost:5000/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mackbook pro",
    "precio": 1500.99,
    "stock": 8
  }'
```
**Respuesta esperada:**
```json
{
    "id": "61cfe0f2-efcc-459d-85d5-95d89b81ac18",
    "nombre": "Mackbook pro",
    "precio": 1500.99,
    "stock": 8,
    "createdAt": "2025-07-16T19:25:25.514Z",
    "updatedAt": "2025-07-16T19:25:25.514Z"
}
```
### 2. Obtener todos los productos

```bash
curl -X GET http://localhost:5000/productos
```

### 3. Obtener un producto por ID

```bash
curl -X GET http://localhost:5000/productos/porid/61cfe0f2-efcc-459d-85d5-95d89b81ac18
```

### 4. Actualizar un producto

```bash
curl -X PATCH http://localhost:5000/productos/61cfe0f2-efcc-459d-85d5-95d89b81ac18 \
  -H "Content-Type: application/json" \
  -d '{
    "precio": 2054.99,
    "stock": 55
  }'
```

### 5. Eliminar un producto

```bash
curl -X DELETE http://localhost:3000/productos/61cfe0f2-efcc-459d-85d5-95d89b81ac18
```
## Ejemplos de Respuestas de Error

### Error de validación

**Response:**
```json
{
    "statusCode": 400,
    "timestamp": "2025-07-16T19:55:55.231Z",
    "path": "/productos",
    "method": "POST",
    "message": "El precio mínimo es 0.01., El precio debe ser un valor positivo."
}
```

## Buenas Prácticas

### Validaciones
- **DTOs** con decoradores de class-validator
- **Pipes de validación** globales
- **Transform** automático de tipos

### Base de Datos
- **TypeORM** para ORM
- **Migraciones** automáticas en desarrollo
- **Conexión segura** con variables de entorno
- **Validación de UUID** en parámetros

### Manejo de Errores
- **Respuestas consistentes** de error
- **Códigos de estado HTTP** apropiados
- **Filtro de excepciones** global personalizado
- **Logging** detallado de errores

### GitHub Actions

## Integración Continua: Pruebas Unitarias con GitHub Actions

Este proyecto utiliza **GitHub Actions** para ejecutar automáticamente las pruebas unitarias en cada push o pull request hacia cualquier rama (`branches: [ "*" ]`).

### Workflow de Pruebas

Ubicado en `.github/workflows/test.yml`

### ¿Qué hace este workflow?

1. **Clona el repositorio**
2. **Instala Node.js v22**
3. **Instala las dependencias del proyecto**
4. **Ejecuta los tests con Jest**

### Script del workflow (`test.yml`)

## Autor

- **Alejandro restrepo** - *Desarrollador fullstack* - [TuGitHub](https://github.com/alejandrorndev)