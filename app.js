// Mis variables de entorno guardadas en .env.
require('dotenv').config();

// E'to son los reales módulos que uno necesita pa' la app.
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { engine } = require('express-handlebars');
const path = require('path');
const { Pool } = require('pg');


// App en Express, papá.
const app = express();

// Mi base de datos, hay que configurarla usando las variables de entorno que están en mi dotenv.
const pool = new Pool({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  });

// Aquí verificamos la conexión a la base de datos.
pool.connect()
  .then(() => console.log('Conectado a la base de datos... :)'))
  .catch(err => console.error('Oh, oh. Ha habido un error de conexión :(', err.stack));

// Configuración de Handlebars en la app, papá, porque sino, no renderizamos.
app.engine('handlebars', engine({
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    defaultLayout: 'main',
    helpers: {
      multiply: function (a, b) {
        return a * b;
      },
      calculateTotal: function (cart) {
        return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2);
      }
    }
  }));
  
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware de seguridad
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Middleware de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
    },
  }));

// Aquí yacen los archivos estáticos ma' jevi (bueno, la ubicación, el directorio donde están).
app.use(express.static(path.join(__dirname, 'public')));


// Configuración de las rutas para la renderización de mis vistas
app.get('/', (req, res) => {
    res.render('public/index', {
      layout: 'main',
      title: 'Inicio',
    });
  });

// Acá importamos nuestras rutas, mi gente.
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const userRoutes = require('./routes/userRoutes');
const partialsRoutes = require('./routes/partialsRoutes');
const authRoutes = require('./routes/authRoutes');
const registerRoutes = require('./routes/registerRoutes');
const productRoutes = require('./routes/productRoutes');

// Acá le decimos a la app que las use.
app.use('/admin', adminRoutes);
app.use('/', publicRoutes);
app.use('/user', userRoutes);
app.use('/partials', partialsRoutes);
app.use('/auth', authRoutes);
app.use('/register', registerRoutes);
app.use('/admin', productRoutes);

// Manejo de errores
app.use((req, res, next) => {
    res.status(404).send("Lo sentimos, no encontramos lo que estás buscando.");
  });
  

// El servidor, klk tú dice'. Esto va al final, por cierto.
const PUERTO = process.env.PUERTO || 5000; //Puse 5000 en vez de 3000 porque me gusta más.
app.listen(PUERTO, () => {
  console.log(`El servidor está corriendo en http://localhost:${PUERTO}`);
});
