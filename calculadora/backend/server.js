const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const port = 4000;

//Configuracion de la base de datos
const pool = new Pool({
  user: 'postgres',           // Tu usuario de Postgres
  host: '127.0.0.1',         // Porque la base de datos está en tu PC
  database: 'postgres',      // El nombre que sale en DBeaver
  password: 'Shadow2802x', // La que pusiste al instalar Postgres
  port: 5432,                // El puerto estándar
});

//Prueba de conextion de la base de datos
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error de conexión:', err.stack);
  } else {
    console.log('✅ ¡Conectado a Postgres! La hora es:', res.rows[0].now);
  }
});

// Middleware para que el servidor entienda JSON (lo que enviará la calculadora)
app.use(express.json());
app.use(cors({
    origin: 'https://turbo-zebra-v64g5jw455g73w4q9-5502.app.github.dev', // La URL de tu calculadora
    methods: ['GET', 'POST']
    //Metodos comunes:     GET: Dame    POST: Enviar/Crear    PUT: Reemplazar    DELETE: Borra
}));

// Esta es una ruta "raíz" por si olvidas poner /api/status
app.get('/', (req, res) => {
    console.log("¡Alguien entró a la raíz!");
    res.send("Servidor funcionando, pero intenta ir a /api/status");
});

app.get('/api/status', (req, res) => {
    console.log("Petición de estatus recibida");
    res.json({ mensaje: "¡Conexión exitosa! 🚀" });
});

//Para encender el servidor
app.listen(port, "0.0.0.0", () => { // 🚩 El "0.0.0.0" ayuda en la nube
    console.log(`Servidor activo en puerto ${port}`);
});