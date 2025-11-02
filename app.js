import express from 'express';
import morgan from 'morgan';
import { renderFile } from 'ejs';

// Database
import { connectMongoose } from './lib/connectMongoose.js';

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
app.get('/', (req, res) => {
    res.render('index', { title: 'Nodepop V0.1' });
});

/**
 * Error Handlers
 ********/
// 404 Error Handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Server Error Handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    res.status(err.status || 500);
    res.render('error');
});

export default app;