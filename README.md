# Nodepop

Ejercicio del Módulo Backend con NodeJS + Express.
Simula un website SSR de un servicio de venta de artículos de segunda mano.

## 🖥️ Requisitos previos

- Node.js v22.20.0 o superior
- MongoDB instalado y corriendo
- npm

## ✈️ Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Bitxogm/Practica-Backend
cd nodepop
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` en la raíz del proyecto con:
```env
MONGO_URI=mongodb://localhost:27017/nodepop
PORT=3000
NODE_ENV=development
```

## 🗄️ Inicializar la Base de Datos

Cargar datos iniciales (productos de ejemplo):
```bash
npm run initDB
```

El script te preguntará si deseas borrar los datos existentes. Escribe `s` para confirmar.

## 💻 Arrancar el servidor 

**Modo desarrollo (con nodemon):**
```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

## 📁 Estructura del Proyecto

TODO: Completar al finalizar el proyecto

## 🛠️ Scripts disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm start` - Inicia el servidor en modo producción
- `npm run initDB` - Inicializa la base de datos con datos de prueba

## 🔧 Variables de Entorno

- `MONGO_URI` - URI de conexión a MongoDB
- `PORT` - Puerto del servidor (por defecto: 3000)
- `NODE_ENV` - Entorno de ejecución (development/production)

## 📦 Dependencias principales

- **express** - Framework web
- **mongoose** - ODM para MongoDB
- **ejs** - Motor de plantillas
- **morgan** - Logger de peticiones HTTP
- **nodemon** - Recarga automática en desarrollo