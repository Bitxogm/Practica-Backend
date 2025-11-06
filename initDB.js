import readline from 'node:readline/promises';
import { connectMongoose } from './lib/connectMongoose.js';
import { Product } from './models/Product.js';
import { User } from './models/User.js';


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

// Función para inicializar usuarios
async function seedUsers() {
  console.log('\n👥 Borrando usuarios antiguos...');
  const deleteResult = await User.deleteMany();
  console.log(`✅ ${deleteResult.deletedCount} usuarios borrados`);

  console.log('\n📦 Creando usuarios iniciales...');
  
  const users = [
    { email: 'user@nodepop.com', password: await User.hashPassword('1234') },
    { email: 'admin@nodepop.com', password: await User.hashPassword('1234') }
  ];

  await User.insertMany(users);
  console.log(`✅ ${users.length} usuarios creados`);
  
  const allUsers = await User.find();
  console.log('\n📋 Usuarios en la BD:');
  console.table(allUsers.map(u => ({
    Email: u.email,
    Creado: u.createdAt.toLocaleDateString()
  })));
}

// Función para inicializar productos
async function seedProducts() {
  console.log('\n📦 Borrando productos antiguos...');
  const deleteResult = await Product.deleteMany();
  console.log(`✅ ${deleteResult.deletedCount} productos borrados`);

  console.log('\n📦 Cargando productos iniciales...');
  
  // Obtener usuarios para asignar productos
  const [user, admin] = await Promise.all([
    User.findOne({ email: 'user@nodepop.com' }),
    User.findOne({ email: 'admin@nodepop.com' })
  ]);

  // Crear producto
  const products = [
    {
      name: 'Bicicleta',
      price: 230.15,
      tags: ['lifestyle', 'motor'],
      owner: user._id
    },
    {
      name: 'iPhone 15 Pro',
      price: 999.99,
      tags: ['mobile', 'lifestyle'],
      owner: user._id
    },
    {
      name: 'MacBook Pro',
      price: 2500.00,
      tags: ['work', 'lifestyle'],
      owner: admin._id
    },
    {
      name: 'Tesla Model 3',
      price: 45000.00,
      tags: ['motor'],
      owner: admin._id
    },
    {
      name: 'Silla Gaming',
      price: 350.00,
      tags: ['work'],
      owner: user._id
    }
  ];

  await Product.insertMany(products);
  console.log(`✅ ${products.length} productos insertados`);

  // Mostrar los productos cargados con sus propietarios
  const allProducts = await Product.find().populate('owner', 'email');
  console.log('\n📋 Productos nuevos en la BD:');
  console.table(allProducts.map(p => ({
    Nombre: p.name,
    Precio: `${p.price}€`,
    Tags: p.tags.join(', '),
    Propietario: p.owner.email
  })));
}


// Conectar a MongoDB
const connection = await connectMongoose();
console.log(`✅ Connected to MongoDB: ${connection.name}`);

// Mostrar productos actuales antes de borrar
console.log('\n📋 Productos actuales en la BD:');
const existingProducts = await Product.find().populate('owner', 'email');

if (existingProducts.length === 0) {
  console.log('  (No hay productos)');
} else {
  const tableData = existingProducts.map(p => ({
    Nombre: p.name,
    Precio: `${p.price}€`,
    Tags: p.tags.join(', '),
    Propietario: p.owner ? p.owner.email : 'Sin owner'
  }));
  console.table(tableData);
  console.log(`\n  Total: ${existingProducts.length} productos`);
}

// Pregunta de seguridad
const checkAnswer = await ask('\n🤔 ¿Aceptas borrar estos datos? (s/N) ');
if (checkAnswer.toLowerCase() !== 's') {
  console.log('🚫 Operación cancelada');
  await connection.close();
  process.exit(0);
}

console.log('\n🗑️  Iniciando proceso de limpieza y carga...');

await seedUsers();      
await seedProducts();   
console.log('\n✅ Proceso completado exitosamente');

await connection.close();
process.exit(0);