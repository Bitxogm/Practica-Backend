import readline from 'node:readline/promises';
import { connectMongoose } from './lib/connectMongoose.js';
import { Product } from './models/Product.js';

// Función para preguntar por consola
async function ask(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const result = await rl.question(question);
    rl.close();
    return result;
}

// Conectar a MongoDB
const connection = await connectMongoose();
console.log(`Connected to MongoDB: ${connection.name}`);

//Mostratr productos actuales  enla base actual.
console.log('\n📋 Productos actuales en la BD:');
const existingProduts = await Product.find();
if(existingProduts.length === 0) {
  console.log('No hay productos en la BD');
} else {
  const tableData = existingProduts.map(p => ({
    Nombre : p.name,
    Precio : `${p.price}$`,
    Tags: p.tags.join(', '),
  }));
  console.table(tableData);
  console.log(`\n Total: ${existingProduts.length} productos`)
  };

// Pregunta de seguridad
const checkAnswer = await ask('¿Aceptas borrar los datos antiguos? (s/N) ');
if (checkAnswer.toLowerCase() !== 's') {
  console.log('🚫 Operación cancelada');
  process.exit(0);
}

console.log('🗑️  Borrando datos antiguos...');

// Borrar todos los productos
await Product.deleteMany();

console.log(`✅ ${existingProduts.length} productos borrados`);

console.log('📦 Cargando productos iniciales...');

// Crear productos iniciales
const products = [
  {
    name: 'Bicicleta',
    price: 230.15,
    tags: ['lifestyle', 'motor']
  },
  {
    name: 'iPhone 15 Pro',
    price: 999.99,
    tags: ['mobile', 'lifestyle']
  },
  {
    name: 'MacBook Pro',
    price: 2500.00,
    tags: ['work', 'lifestyle']
  },
  {
    name: 'Tesla Model 3',
    price: 45000.00,
    tags: ['motor']
  },
  {
    name: 'Silla Gaming',
    price: 350.00,
    tags: ['work']
  }
];

await Product.insertMany(products);

console.log(`✅ ${products.length} productos cargados`);

// Mostrar los productos cargados en tabla , no podemos usar foreach (p => {console.log(p.name, p.price, p.tags)})
const allProducts = await Product.find();
console.log('\n📋 Productos nuevos en la BD:');
const newTableProducts = allProducts.map(p => ({
  Nombre: p.name,
  Precio: `${p.price}$`,
  Tags: p.tags.join(', ')
}));

console.table(newTableProducts);

await connection.close();
process.exit(0);