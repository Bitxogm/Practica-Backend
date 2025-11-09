import session from 'express-session';
import ConnectMongo from 'connect-mongo';

const INACTIVITY_7_DAYS = 1000 * 60 * 60 * 24 * 7;

// Middleware para proteger rutas (requiere login)
export function guard(req, res, next) {
    if (!req.session.userId ) {
        const redirect = req.url;
        console.log('⚠️ Acceso denegado, redirigiendo a login');
        return res.redirect(`/login?redir=${redirect}`);
    }
    next();
}

// Configuración de sesiones
export const sessionMiddleware = session({
    name: 'nodepop-session',
    secret: process.env.SESSION_SECRET || 'nodepop-secret-change-in-production',
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: INACTIVITY_7_DAYS,
    },
    store: ConnectMongo.create({
        mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/nodepop',
    })
});

// Hacer sesión disponible en todas las vistas
export function sessionInViews(req, res, next) {
    res.locals.session = req.session;
    next();
}