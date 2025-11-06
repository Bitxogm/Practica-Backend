import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    index: true
  },
  tags: {
    type: [String],
    index: true
  },
  owner: {                        
    type: Schema.Types.ObjectId,  
    ref: 'User',                  
    required: true,               
    index: true                   
  }
}, {
  timestamps: true  
});

// Indice compuesto , para buscar productos de un usuario sin recorrer todos
// productSchema.index({ owner: 1 });

productSchema.index({ owner: 1, createdAt: -1 });

export const Product = model('Product', productSchema);