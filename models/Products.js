import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  tags: [{ 
    type: String, 
    enum: ['work', 'lifestyle', 'motor', 'mobile'] 
  }]
});

export const Product = mongoose.model('Product', productSchema);