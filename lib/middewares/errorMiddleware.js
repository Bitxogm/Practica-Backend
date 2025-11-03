export function serverErrorHandler(error, req, res, next) {
    console.error("[ERROR]", error.message);
    console.error(error.stack);
    
    // Si es petición HTML (navegador)
    if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
        res.status(500).render('error500.html', {
            title: '500 - Error del servidor',
            message: error.message,
            error: req.app.get('env') === 'development' ? error : {},
            env: process.env.NODE_ENV || 'production'
        });
    } else {
        // Si es petición JSON (API)
        res.status(500).json({ 
            success: false,
            error: 'Internal server error',
            message: req.app.get('env') === 'development' ? error.message : 'Ha ocurrido un error inesperado'
        });
    }
}

export function notFoundErrorHandler(req, res, next) {
    // Si es petición HTML (navegador)
    if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
        res.status(404).render('error404.html', {
            title: '404 - Página no encontrada',
            env: process.env.NODE_ENV || 'production'
        });
    } else {
        // Si es petición JSON (API)
        res.status(404).json({ 
            success: false,
            error: 'Resource not found',
            message: 'La ruta solicitada no existe'
        });
    }
}