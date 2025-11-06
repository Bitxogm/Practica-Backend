import express from 'express';
import { body } from 'express-validator';

import { loginController } from '../controllers/loginController.js';
import { productController } from '../controllers/productController.js';
import { guard } from '../lib/middlewares/authMiddleware.js';
import { validarResultados } from '../controllers/validarResultados.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';

export const router = express.Router();

/**
 * Auth Routes
 */
// GET /login , muestra formulario
router.get('/login', loginController.index);
router.post('/login',
    body('email', 'Email requerido')
        .notEmpty()
        .bail()
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),

    body('password', 'Contraseña requerida')
        .notEmpty()
        .bail()
        .isLength({ min: 4 })
        .withMessage('Contraseña debe tener al menos 4 caracteres'),



    validarResultados,
    loginController.postLogin);


router.get('/logout', loginController.logout);

/**
 * Protected Routes (requieren login)
 */
router.get('/', guard, productController.list);

/**
 * Test Routes (eliminar después)
 */
router.get('/test-error', (req, res, next) => {
    throw new Error('Error de prueba para ver el 500');
});

//Ruta temporal probar productos owner
router.get('/api/my-products' , guard, async (req, res, next) => {
    try{
        const products = await Product.find({
            owner: req.session.userId
        }).populate('owner', 'email');

        res.json({
            success: true,
            user: req.session.userEmail,
            count: products.length,
            products: products
        });
    }catch(error){
        next(error)
    }
});

