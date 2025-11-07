import { User } from '../models/User.js';
export const loginController = {

  index: (req, res, next) => {
    // 1. Leer los datos de la URL (Query Strings)
    const { error, email } = req.query; 

    // 2. Si hay errores, los separamos y los unimos con <br>
    const errors = error ? error.split('|||').join('<br>') : null; 
    
    // 3. Renderizar la vista, pasando los datos
    res.render('login.html', { // Asumiendo que 'login' es el nombre de tu vista
        title: 'Iniciar Sesión',
        errors: errors,   // Para mostrar la caja de error
        email: email || '', // Para rellenar el campo de email si falla la validación
    });
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
