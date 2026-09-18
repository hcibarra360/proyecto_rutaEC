const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Soporte para Bcrypt

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de PostgreSQL (Contraseña corregida a 123456)
const pool = new Pool({
  user: 'rutaec',
  host: 'localhost',
  database: 'rutaec_db',
  password: '123456', // <--- Corregido
  port: 5432,
});

// Configuración de Redis
const redisClient = redis.createClient({ url: 'redis://localhost:6379' });
redisClient.connect().catch(console.error);

// -------------------------------------------------------------
// RUTAS DE AUTENTICACIÓN (LOGIN Y REGISTRO)
// -------------------------------------------------------------

// POST /api/v1/auth/login
app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const user = result.rows[0];

    // Verifica si la contraseña coincide (Texto plano O Bcrypt)
    let isMatch = false;
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = (user.password === password);
    }

    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    // Respuesta con datos del usuario y token dummy
    return res.json({
      token: 'jwt_token_dummy_rutaec_123',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

// POST /api/v1/auth/register
app.post('/api/v1/auth/register', async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    const userRole = rol || 'pasajero';
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
      [nombre, email, hashedPassword, userRole]
    );

    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error en registro:', error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

// -------------------------------------------------------------
// OTRAS RUTAS
// -------------------------------------------------------------

// Ruta Principal / Popular
app.get('/api/v1/routes/popular', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rutas');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al consultar rutas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Iniciar Servidor
// Iniciar Servidor
app.listen(port, '0.0.0.0', () => {
  console.log('Servidor Backend corriendo en http://192.168.1.14:${port}');
});