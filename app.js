import express from 'express';
import morgan from 'morgan';
import { renderFile } from 'ejs';

// Database
import { connectMongoose } from './lib/connectMongoose.js';

// Controllers
import  { productController } from './controllers/productController.js';

// Middlewares
import { notFoundErrorHandler, serverErrorHandler } from './lib/middewares/errorMiddleware.js';

const app = express();

// Top level await disponible desde ES2022 en módulos
const connection = await connectMongoose();
console.log(`✅ Connected to MongoDB: ${connection.name}`);

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// View engine setup
app.set('view engine', 'ejs');
app.engine('html', renderFile);
app.set('views', './views');

// 3rd Party Middlewares
app.use(morgan('dev'));

// Setting Environment
app.use((req, res, next) => {
    res.locals.env = process.env.NODE_ENV || 'development';
    res.locals.appName = 'Nodepop';
    next();
});



/**
 * Routes
 ********/
// Ruta temporal de prueba
// app.get('/', (req, res) => {
//     res.render('index', { title: 'Nodepop V0.1' });
// });
app.get('/', productController.getAllProducts);

app.get('/test-error', (req, res, next) => {
    throw new Error('Error de prueba para ver el 500');
});




/**
 * Error Handlers
 ********/
// 404 Error Handler
app.use(notFoundErrorHandler);

// Server Error Handler
app.use(serverErrorHandler);
export default app;