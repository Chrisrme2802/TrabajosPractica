//Importamos la herramienta Pool de la libreria "pg" postgreSQL
const { Pool } = require('pg');
//Cargamos las variables de entorno del .env (contraseñas por ejemplo)
require('dotenv').config();

//Configuracion de la Pool (casi siempre es la misma)
//max: Cuántas "líneas telefónicas" (conexiones) permites abiertas al mismo tiempo (por defecto son 10).
//idleTimeoutMillis: Cuánto tiempo esperar antes de cerrar una línea que nadie está usando.
//connectionTimeoutMillis: Cuánto tiempo intentar conectar antes de rendirse y dar error.
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

//Lo exportamos para que node.js lo pueda usar
module.exports = pool;