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
    // --- Productos asignados a user@nodepop.com (La mayoría) ---
    { name: 'Sillín ergonómico de bicicleta', price: 45.90, tags: ['motor', 'lifestyle'], owner: user._id },
    { name: 'Auriculares Inalámbricos QCY', price: 65.00, tags: ['mobile', 'lifestyle'], owner: user._id },
    { name: 'Monitor 4K Dell Ultrasharp', price: 549.99, tags: ['work'], owner: user._id },
    { name: 'Cámara Réflex Canon EOS', price: 890.00, tags: ['lifestyle'], owner: user._id },
    { name: 'Libro: Programación Avanzada en JS', price: 29.50, tags: ['work', 'lifestyle'], owner: user._id },
    { name: 'Funda de Silicona para iPhone 15', price: 15.00, tags: ['mobile'], owner: user._id },
    { name: 'Moto Vespa Clásica (1985)', price: 3200.00, tags: ['motor'], owner: user._id },
    { name: 'Apple iPad Air (última generación)', price: 689.00, tags: ['mobile', 'work'], owner: user._id },
    { name: 'Mesa de Escritorio de Altura Ajustable', price: 299.99, tags: ['work'], owner: user._id },
    { name: 'Zapatillas Deportivas Running', price: 85.00, tags: ['lifestyle'], owner: user._id },
    { name: 'Altavoz Bluetooth Portátil JBL', price: 120.00, tags: ['mobile', 'lifestyle'], owner: user._id },
    { name: 'Disco Duro Externo SSD 1TB', price: 95.50, tags: ['work'], owner: user._id },
    { name: 'Casco Modular para Moto', price: 190.00, tags: ['motor'], owner: user._id },
    { name: 'Reloj Inteligente Garmin', price: 349.00, tags: ['mobile', 'lifestyle'], owner: user._id },
    { name: 'Silla Ergonómica de Oficina', price: 450.00, tags: ['work'], owner: user._id },
    { name: 'Bicicleta de Montaña Specialized', price: 1500.00, tags: ['lifestyle'], owner: user._id },
    { name: 'Cargador Rápido USB-C (65W)', price: 25.00, tags: ['mobile'], owner: user._id },
    { name: 'Juego de Herramientas Completo', price: 140.00, tags: ['motor', 'work'], owner: user._id },
    { name: 'Teclado Mecánico RGB', price: 99.99, tags: ['work'], owner: user._id },
    { name: 'E-Scooter Eléctrico', price: 599.00, tags: ['motor', 'lifestyle'], owner: user._id },
    { name: 'Teléfono Fijo Vintage', price: 30.00, tags: ['lifestyle'], owner: user._id },

    // --- Productos asignados a admin@nodepop.com (Para la lista del otro usuario) ---
    { name: 'Drone DJI Mavic Pro 3', price: 1800.00, tags: ['lifestyle', 'mobile'], owner: admin._id },
    { name: 'Tarjeta Gráfica RTX 4080', price: 1150.00, tags: ['work'], owner: admin._id },
    { name: 'Silla Eames Lounge Original', price: 4500.00, tags: ['lifestyle'], owner: admin._id },
    { name: 'Bicicleta Eléctrica Plegable', price: 950.00, tags: ['motor', 'lifestyle'], owner: admin._id },
    { name: 'Impresora 3D Creality Ender 5', price: 380.00, tags: ['work'], owner: admin._id },
    { name: 'Coche Clásico Porsche 911 (1980)', price: 75000.00, tags: ['motor'], owner: admin._id },
    { name: 'Lente para Cámara Sony 70-200mm', price: 1300.00, tags: ['lifestyle'], owner: admin._id },
    { name: 'Kit Arduino Mega y Sensores', price: 65.00, tags: ['work'], owner: admin._id },
    { name: 'Altavoz Inteligente Google Home', price: 89.00, tags: ['mobile'], owner: admin._id },
    { name: 'Monitor Curvo Samsung 34"', price: 420.00, tags: ['work', 'lifestyle'], owner: admin._id },
    { name: 'Robot Aspirador iRobot Roomba', price: 299.00, tags: ['lifestyle'], owner: admin._id },
    { name: 'Scooter Eléctrico Ninebot Max G2', price: 650.00, tags: ['motor', 'mobile'], owner: admin._id },
    { name: 'Tablet Microsoft Surface Pro 9', price: 999.00, tags: ['work', 'mobile'], owner: admin._id },
    { name: 'Mesa de Dibujo Digital Wacom', price: 750.00, tags: ['work'], owner: admin._id },
    { name: 'Teléfono Satelital Iridium', price: 1500.00, tags: ['mobile'], owner: admin._id },
    { name: 'Furgoneta Camperizada VW T6', price: 40000.00, tags: ['motor', 'lifestyle'], owner: admin._id }, 
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
    Tags: (p.tags || []).join(', '),
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