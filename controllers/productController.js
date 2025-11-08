import { Product } from '../models/Product.js';

export const productController = {

  //GET - Obtener productos de un usuariopor filtro
  list: async (req, res, next) => {
    try {
      //  Filtros
      const filters = {
        owner: req.session.userId
      };

      // Filtro por tags 
      if (req.query.tags) {
        // Convertir string  a array 
        const tagsArray = req.query.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
        if (tagsArray.length > 0) {
          // Utilizamos $in para enncontrar productos con tags
          filters.tags = { $in: tagsArray };
        }
      }

      // Filtro por nombre con new RegExp para busqueda expresiones regulares ,'i para case insensitive
      if (req.query.name) {
        filters.name = new RegExp('^' + req.query.name, 'i');
      }

      // Filtro por precio 
      if (req.query.priceMin || req.query.priceMax) {
        filters.price = {};
        if (req.query.priceMin) {
          // Aseguramos que sea un número flotante
          filters.price.$gte = parseFloat(req.query.priceMin); // $gte = Greater Than or Equal
        }
        if (req.query.priceMax) {
          // Aseguramos que sea un número flotante
          filters.price.$lte = parseFloat(req.query.priceMax); // $lte = Less Than or Equal
        }
      }

      // Paginación 
      // Usamos la API de Mongoose: find().sort().skip().limit().exec()

      const skip = parseInt(req.query.skip) || 0; // CVonvertimos a eentero , ya que viene como string de la URL
      const limit = parseInt(req.query.limit) || 0; // 0 o no definido = sin límite

      // Iiciamos la consulta de Mongoose , con los filtros quie hemos construido.
      // .sort() , metiodo de Mongoose para ordenar , por orden de creacion
      let query = Product.find(filters).sort({ createdAt: -1 });

      //  Paginación si los valores son válidos
      if (skip > 0) {
        query = query.skip(skip);
      }

      if (limit > 0) {
        query = query.limit(limit);
      }

      // Ejecutar la consulta con .exec()
      // const products = await query.exec();

      //Ejecutar la consulta sin .exec()
      const products = await query

      // 4. Renderizar la vista
      res.render('home.html', {
        title: 'Nodepop - Mis Productos',
        products: products,
        query: req.query // Pasar la query para mantener el estado de los filtros
      });

    } catch (error) {
      next(error);
    }
  },

  // GET - Mostrar Formulario para crear productos
  createForm: (req, res, next) => {
    res.render('product-form.html', {
      title: 'Nuevo Producto',
      errors: '',
      product: {
        name: '',
        price: '',
        tags: []
      }
    });
  },

  //POST - Crear nuevo productos
  create: async (req, res, next) => {
    try {
      const { name, price, tags } = req.body;

      //Procesamos el array de tags , para separar por comas 
      // const tagsArray = tags
      //   ? tags
      //     .split(',')
      //     .map(tag => tag.trim())
      //     .filter(tag => tag.length > 0)
      //   : [];


      const product = new Product({
        name,
        price,
        tags,
        owner: req.session.userId
      });

      await product.save();
      console.log('✅ Producto creado:', product);
      res.redirect('/');

    } catch (error) {
      next(error)
    }
  },

  //POST - Eliminar productos
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }
      if (!product.owner.equals(req.session.userId)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para eliminar este producto'
        });
      }
      await Product.deleteOne({ _id: id });

      if (req.accepts('json')) {

      }
      res.redirect('/?deleted=true');
    } catch (error) {
      next(error)
    }
  }
}