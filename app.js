import express from 'express';
import morgan from 'morgan';
import { renderFile } from 'ejs';

// Database
import { connectMongoose } from './lib/connectMongoose.js';

// Middlewares
import { sessionMiddleware, sessionInViews } from './lib/middlewares/authMiddleware.js';
import { serverErrorHandler, notFoundErrorHandler } from './lib/middlewares/errorMiddleware.js';

// Routes
import { router as webRouter } from './routes/webRoutes.js';

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

/**
 * Custom Middlewares
 */
// Setting Environment
app.use((req, res, next) => {
    res.locals.env = process.env.NODE_ENV || 'development';
    res.locals.appName = 'Nodepop';
    next();
});

// Session Middlewares
app.use(sessionMiddleware);
app.use(sessionInViews);

/**
 * Routes
 ********/
app.use('/', webRouter);

/**
 * Error Handlers
 ********/
app.use(notFoundErrorHandler);
app.use(serverErrorHandler);

export default app;