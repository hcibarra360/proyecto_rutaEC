const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');
const cors = require('cors');

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de PostgreSQL
const pool = new Pool({
  user: 'rutaec',
  host: 'localhost',
  database: 'rutaec_db',
  password: '123456',
  port: 5432,
});

// Configuración de Redis
const redisClient = redis.createClient({ url: 'redis://localhost:6379' });
redisClient.connect().catch(console.error);

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
app.listen(port, () => {
  console.log(`Servidor Backend corriendo en http://localhost:${port}`);
});