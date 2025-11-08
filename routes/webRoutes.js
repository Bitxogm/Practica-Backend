import express from 'express';
import { body, param } from 'express-validator';

import { loginController } from '../controllers/loginController.js';
import { productController } from '../controllers/productController.js';
import { guard } from '../lib/middlewares/authMiddleware.js';
import { validateResults } from '../controllers/validateResults.js';
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

    validateResults,
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
        .withMessage('Los tags deben ser un string')
        .customSanitizer(value => {
            if (typeof value === 'string') {
                return value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            }
            return value;
        })
        .custom((tagArray) => {
            // Este `tagArray` es el resultado del `customSanitizer` (un array de strings).
            const allowedTags = ['work', 'motor', 'lifestyle', 'mobile'];
            const invalidTags = tagArray.filter(tag => !allowedTags.includes(tag));

            return  invalidTags.length === 0 ;
        })
        .withMessage(`Los tags deber alguno de estos work, motor, lifestyle, mobile`),

    validateResults,
    productController.create
);

router.post('/products/delete/:id', guard,
    param('id')
        .isMongoId()
        .withMessage('ID de producto inválido'),

    validateResults,
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

router.get('/api/debug-products', async (req, res, next) => {
    try {
        const allProducts = await Product.find();
        const users = await User.find();

        res.json({
            session: {
                userId: req.session.userId,
                userEmail: req.session.userEmail
            },
            users: users.map(u => ({
                id: u._id.toString(),
                email: u.email
            })),
            products: allProducts.map(p => ({
                id: p._id.toString(),
                name: p.name,
                owner: p.owner ? p.owner.toString() : null,
                hasOwner: !!p.owner
            }))
        });
    } catch (error) {
        next(error);
    }
});
