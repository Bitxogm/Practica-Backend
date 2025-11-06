import { User } from '../models/User.js';
export const loginController = {

    index: (req, res, next) => {
        res.locals.errors = '';
        res.locals.email = '';
        res.render('login.html');
    },

    postLogin: async (req, res, next) => {

        try {
           
            const user = await User.findOne({
                email: req.body.email,
            }).select('+password');

            if (!user || !(await user.comparePassword(req.body.password))) {
                // Usuario o password incorrecto
                res.locals.email = req.body.email;
                res.locals.errors = 'Credenciales invalidas';
                return !res.render('login.html');
            }

            req.session.userId = user._id;
            req.session.userEmail = user.email;

            res.redirect( req.query.redir || '/' );

        } catch(error) {
            next(error);
        }
    },

    logout: (req, res, next) => {

        req.session.regenerate((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });

    },
};
