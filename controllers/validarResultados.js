// validarResultados.js (Versión Híbrida)
import { validationResult } from 'express-validator';

export const validarResultados = (redirectToUrl) => (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    
    // 🚨 1. Detección de Cliente
    const acceptsJson = req.accepts('json');

    if (acceptsJson) {
      // Si el cliente (Postman) acepta JSON, devolvemos JSON 400
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array().map(err => ({
          campo: err.param,
          mensaje: err.msg,
          valor: err.value,
          ubicacion: err.location
        }))
      });
    } 
    
    // ----------------------------------------------------
    // SI NO ES JSON (es formulario web), HACEMOS LA REDIRECCIÓN (SSR)
    // ----------------------------------------------------

    const errorMessages = errors.array().map(err => err.msg).join('|||'); 
    const data = req.body;
    let queryParams = `error=${errorMessages}`;

    for (const key in data) {
      if (key !== 'password') { 
        queryParams += `&${key}=${encodeURIComponent(data[key] || '')}`;
      }
    }

    // Redirección para SSR
    return res.redirect(`${redirectToUrl}?${queryParams}`);
  }
  
  next();
};