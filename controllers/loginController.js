import { User } from '../models/User.js';

export const loginController = {

    index: (req, res, next) => {
        res.locals.errors = '';
        res.locals.email = '';
        res.render('login.html'), {
            title: 'Nodepop - Login',
            errors: '',
            email: '',

        };
    },

    postLogin: async (req, res, next) => {
        try {
            // Buscamos el usuario en la base de datos
            const user = await User.findOne({
                email: req.body.email,
            });

            // Comparar password
            if (!user || !(await user.comparePassword(req.body.password))) {
                // Usuario o password incorrecto
                res.locals.email = req.body.email;
                res.locals.errors = 'Credenciales inválidas.';
                return res.render('login.html', {
                    title: 'Nodepop - Login',
                    email: req.body.email,
                    errors: 'Credenciales inválidas.',
                });
            }

            req.session.userId = user._id;
            req.session.userEmail = user.email;

            console.log('✅ Login exitoso:', user.email);
            res.redirect(req.query.redir || '/');

        } catch(error) {
            next(error);
        }
    },

    logout: (req, res, next) => {
        req.session.regenerate((err) => {
            if (err) {
                return next(err);
            }
            console.log('✅ Sesión cerrada');
            res.redirect('/');
        });
    },
};