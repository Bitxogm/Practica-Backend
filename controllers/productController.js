import { Product } from '../models/Product.js';

export const productController = {

  //GET -Obtenre productos de cada usuario
  list: async (req, res, next) => {
    try {
      const products = await Product.find({
        owner: req.session.userId
      }).sort({ createdAd: -1 });
      res.render('home.html', {
        title: 'Nodepop - Mis productos',
        products
      })
    } catch (error) {
      next(error)
    }
  },

  //GET - Mostrar Formulario para crear productos
  //   createForm: (req, res, next) => {
  //   res.render('product-form.html', {
  //     title: 'Nuevo Producto',
  //     errors: '',
  //     product: {
  //       name: '',
  //       price: '',
  //       tags: []
  //     }
  //   });
  // },

  createForm: (req, res, next) => {

    // 1. Leer los datos de la URL (Query Strings)
    const { error, name, price, tags } = req.query;

    // 2. Si hay errores en la URL, los separamos
    const errors = error ? error.split('|||').join('<br>') : null;

    // 3. Crear el objeto 'product' usando los datos de la URL si existen, o valores por defecto.
    const product = {
      name: name || '',
      price: price || '',
      tags: tags || [] // Lo pasamos como array vacío si no hay tags
    };

    res.render('product-form.html', {
      title: 'Nuevo Producto',
      errors: errors, // Pasamos la cadena de errores o null
      product: product // Pasamos el producto (con datos ingresados o vacío)
    });
  },

  //POST - Crear nuevo productos
  create: async (req, res, next) => {
    try {
      const { name, price, tags } = req.body;

      //Procesamos el array de tags , para separar por comas 

      //TODO: Refactorizar
      // let  tagsArray = [];
      // if(tags){
      //   const tagsSeparados = tags.split(',');
      //   for (const tag of tagsSeparados) {
      //     const tagClean = tag.trim();
      //     if(tagClean.length > 0) {
      //       tagsArray.push(tagClean)
      //     }
      //   }
      // }

      const tagsArray = tags
        ? tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
        : [];


      const product = new Product({
        name,
        price,
        tags: tagsArray,
        owner: req.session.userId
      });

      await product.save();
      console.log('✅ Producto creado:', product);
      res.redirect('/');

      // res.status(201).json({
      //   success: true,
      //   message: 'Producto creado',
      //   product
      // });

    } catch (error) {
      next(error)
    }
  },

  //POST - Eliminar productos
  //TODO : Probar ambas respuestas , json y navegador .....
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if(!product) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }
      if(!product.owner.equals(req.session.userId)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para eliminar este producto'
        });
      }
      await Product.deleteOne({ _id: id });

      if(req.accepts('json')){

        // res.status(200).json({
          //   success: true,
          //   message: 'Producto eliminado'
          // });
        }
        res.redirect('/');
    } catch (error) {
      next(error)
    }
  }
}

