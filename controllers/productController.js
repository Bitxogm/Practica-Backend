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

  //POST - Crear nuevo productos
  create: async (req, res, next) => {
    try {
      const { name, price, tags } = req.body;

      //Procesamos el array de tags , para separar por comas 
      let  tagsArray = [];
      if(tags){
        const tagsSeparados = tags.split(',');
        for (const tag of tagsSeparados) {
          const tagClean = tag.trim();
          if(tagClean.length > 0) {
            tagsArray.push(tagClean)
          }
        }
      }

      const product = new Product({
        name,
        price,
        tags: tagsArray,
        owner: req.session.userId
      });

      await product.save();
      console.log('✅ Producto creado:', product);

      res.status(201).json({
        success: true,
        message: 'Producto creado',
        product
      });

    } catch (error) {
      next(error)
    }
  }

};