import { validationResult } from 'express-validator';

export const validarResultados = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join('. ');

    // ============================================
    // RUTAS WEB (renderizar HTML con errores)
    // ============================================
    
    // LOGIN
    if (req.path === '/login') {
      return res.render('login.html', {
        title: 'Login - Nodepop',
        errors: errorMessages,
        email: req.body.email || ''
      });
    }

    // CREAR PRODUCTO
    if (req.path === '/products' && req.method === 'POST') {
      return res.render('product-form.html', {
        title: 'Nuevo Producto',
        errors: errorMessages,
        product: {
          name: req.body.name || '',
          price: req.body.price || '',
          tags: req.body.tags ? req.body.tags.split(',') : []
        }
      });
    }

    // ============================================
    // RUTAS API (devolver JSON)
    // ============================================
    
    // Si el header Accept incluye application/json → API
    if (req.headers['accept']?.includes('application/json')) {
      return res.status(400).json({
        success: false,
        message: "Errores de validación",
        errors: errors.array().map(error => ({
          campo: error.path,
          mensaje: error.msg,
          valor: error.value,
          ubicacion: error.location
        }))
      });
    }

    // ============================================
    // FALLBACK (por si acaso)
    // ============================================
    
    return res.status(400).send(errorMessages);
  }
  
  next();
};