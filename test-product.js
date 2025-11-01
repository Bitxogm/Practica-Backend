import { connectMongoose } from './lib/connectMongoose.js';
import { Product } from './models/Products.js';

// Conectar a MongoDB
await connectMongoose();

console.log('✅ Conectado, probando modelo...');

// Crear un producto de prueba
const testProduct = new Product({
  name: 'iPhone 12',
  price: 500,
  tags: ['mobile', 'lifestyle']
});

await testProduct.save();
console.log('✅ Producto guardado:', testProduct);

// Buscar el producto
const found = await Product.findOne({ name: 'iPhone 12' });
console.log('✅ Producto encontrado:', found);

process.exit(0);