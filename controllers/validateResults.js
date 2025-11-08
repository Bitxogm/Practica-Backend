import { validationResult } from 'express-validator';

export const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = `
  <ul class="mb-0">
    ${errors.array().map(error => `<li>${error.msg}</li>`).join('')}
  </ul>
`;

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
          tags: req.body.tags || '' 
        }
      });
    }


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
    return res.status(400).send(errorMessages);
  }
  next();
};