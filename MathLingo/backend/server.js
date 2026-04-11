//Importamos todo lo necesario para el server
//Tema de enrutamiento, middleware entre backend y frontend
const express = require('express');
//Seguridad para comunicarse entre puertos, dominios o esquemas
const cors = require('cors');
//Middleware de registro (logging) intercepta el evento final y lo pasa a stdout
const morgan = require('morgan');
//Procesamiento de variables de entorno
require ('dotenv').config();
//Importaciones de rutas
const authRoutes = require('./routes/authRoutes');

//Instancio app con la libreria express para temas de enrutamiento
const app = express();

//.set para usar motor de plantillas
//.get pedir informacion
//.post dar informacion
//.listen escuchar a un puerto

//Midlewares globales, aquelos que usan .use, sirven para capas de seguridad o traduccion
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use((req, res, next) => {
    //Variaciones: unsafe-none (defecto): permite cualquier cosa es menos seguro
    //same-origin: Cualquier pop up externo a la pagina la rompe, no puedes usar logins externos
    //same-origin-allow-popups: Aisla de otras pestañas, pero los pop ups que tu abriste si los deja pasar
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

//Montaje de rutas
app.use('/auth', authRoutes);

//Rutas de prueba de servidor
//request es lo que mandas
//response es lo que recibes
app.get('/test-db', async (req, res) => {
    try {
        //SELECT NOW() regresa la hora y fecha del sistema 
        const prueba = await pool.query('SELECT NOW()');
        res.json({
            mensaje: "Conexion a la DB exitosa",
            hora_db: prueba.rows[0].now
        });
    } catch (err) {
        console.error(err.mensaje);
        //Tipos de status
        //200 todo bien, 404 no encontre lo que buscabas, 500 internal server error
        res.status(500).send("Error conectandose a la base de datos");
    }
});

//Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});