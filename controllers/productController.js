import { Product } from '../models/Product.js';

export const productController = {

  list: async (req, res, next) => {
    try {
      const products = await Product.find({
        owner: req.session.userId
      }).sort({createAd: -1});
      res.render('home.html', {
        title: 'Nodepop - Mis productos',
        products
      })
    } catch (error) {
      
    }
  }
  
};