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

DOMINGO Otaku. ¡Claro que sí! Aquí tienes el README.md completo con todas las mejoras aplicadas, listo para copiar y pegar en formato Markdown. 🚀

📄 README.md (Formato Markdown)
Markdown

# Nodepop

Ejercicio del Módulo Backend con NodeJS + Express.
Simula un website SSR (Server-Side Rendering) de un servicio de venta de artículos de segunda mano, con **autenticación basada en sesiones**, **paginación** y **filtrado avanzado** de productos.

## 🖥️ Requisitos previos

- **Node.js v22.20.0** o superior
- **MongoDB** instalado y corriendo (Versión 7.0 o superior recomendada)
- npm

---

## ✈️ Instalación

1. Clonar el repositorio:

````bash
git clone [https://github.com/Bitxogm/Practica-Backend](https://github.com/Bitxogm/Practica-Backend)
Instalar dependencias:

Bash

npm install

Crear el archivo .env en la raíz del proyecto con las siguientes variables:

MONGO_URI=mongodb://localhost:27017/nodepop
PORT=3000
NODE_ENV=development
SESSION_SECRET=un_secreto_seguro_para_sesiones

🗄️ Inicializar la Base de Datos y Credenciales

Este paso carga los usuarios de prueba y una colección de 25 productos (21 asignados al usuario de prueba)
para testear la paginación y el filtrado.

Cargar datos iniciales (usuarios y productos):

Bash

npm run initDB
⚠️ El script te preguntará si deseas borrar los datos existentes. Escribe `s` para confirmar.

## 💻 Arrancar el servidor

**Modo desarrollo (con nodemon):**
```bash
npm run dev
````

El servidor estará disponible en: `http://localhost:3000`

El flujo de la aplicacion redirigira al login , puedes acceder con las siguientes credenciales :

Rol Email Contraseña

Usuario (Test) user@nodepop.com 1234

Administrador admin@nodepop.com 1234

## 🛠️ Scripts disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm start` - Inicia el servidor en modo producción
- `npm run initDB` - Inicializa la base de datos con datos de prueba

## 🛑 Pruebas de Manejo de Errores

El proyecto incluye rutas de prueba para verificar que las páginas de error personalizadas (404 y 500) se renderizan correctamente,
en lugar de mostrar los mensajes de error por defecto del servidor.

5️⃣0️⃣0️⃣ Error de Servidor (Interno)

Esta ruta fuerza un error no controlado en el servidor para disparar el middleware de error 500 personalizado.

Error 500 (Fallo interno) Ruta de Prueba -----> http://localhost:3000/test-error.

4️⃣0️⃣4️⃣ Error de Página No Encontrada

Para probar la página 404 (Recurso no encontrado), simplemente accede a cualquier ruta que no esté definida en webRoutes.js.

Error 404 (Ruta inválida)	 Ruta de prueba ------>  http://localhost:3000/ruta-que-no-existe


## 🔧 Variables de Entorno

- `MONGO_URI` - URI de conexión a MongoDB
- `PORT` - Puerto del servidor (por defecto: 3000)
- `NODE_ENV` - Entorno de ejecución (development/production)
- `SESSION_SECRET` - un_secreto_seguro_para_sesiones

## 📦 Dependencias principales

- **express** - Framework web
- **mongoose** - ODM para MongoDB
- **ejs** - Motor de plantillas
- **morgan** - Logger de peticiones HTTP
- **nodemon** - Recarga automática en desarrollo
- **express-sesion / connect-moongo** - Manejo de sesiones persistenetes
