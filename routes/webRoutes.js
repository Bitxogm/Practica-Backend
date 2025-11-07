import express from 'express';
import { body, param } from 'express-validator';

import { loginController } from '../controllers/loginController.js';
import { productController } from '../controllers/productController.js';
import { guard } from '../lib/middlewares/authMiddleware.js';
import { validarResultados } from '../controllers/validarResultados.js';
import { Product } from '../models/Product.js';

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

    validarResultados('/login'),
    loginController.postLogin);

router.get('/logout', loginController.logout);

/**
 * Protected Routes con Login
 */
router.get('/', guard, productController.list);
router.get('/products/new', guard, productController.createForm);

router.post('/products', guard,
    body('name', 'El nombre es requerido')
        .notEmpty()
        .bail()
        .isLength({ min: 3 })
        .withMessage('El nombre debe tener al menos 3 caracteres'),

    body('price', 'El precio es requerido')
        .notEmpty()
        .bail()
        .isFloat({ min: 0.01 })
        .withMessage('El precio debe ser un número mayor a 0')
        .toFloat(),

    body('tags')
        .optional()
        .isString()
        .withMessage('Los tags deben ser texto'),

    validarResultados('/products/new'),
    productController.create
);

router.post('/products/delete/:id', guard,
    param('id')
        .isMongoId()
        .withMessage('ID de producto inválido'),

    validarResultados('/products/delete/:id'),
    productController.delete);
/**
 * Test Routes (eliminar después)
 */
router.get('/test-error', (req, res, next) => {
    throw new Error('Error de prueba para ver el 500');
});

//Ruta temporal probar productos owner
router.get('/api/my-products', guard, async (req, res, next) => {
    try {
        const products = await Product.find({
            owner: req.session.userId
        }).populate('owner', 'email');

        res.json({
            success: true,
            user: req.session.userEmail,
            count: products.length,
            products: products
        });
    } catch (error) {
        next(error)
    }
});

