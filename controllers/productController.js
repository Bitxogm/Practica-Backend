import { Product } from '../models/Product.js';

export const productController = {
  
  // GET / Obtener todos los productos
  getAllProducts: async (req, res, next) => {
    try {
      const products = await Product.find();
      
      res.render('home.html', { 
        title: 'Nodepop - Productos',
        products 
      });
      
    } catch (error) {
      next(error);
    }
  }
  
};