//Importamos todo lo necesario para el server
const express = require('express');
const cors = require('cors');
const pool = require('/db');
require ('dotenv').config();

//Instancio app con la libreria express para temas de enrutamiento
const app = express();

//.set para usar motor de plantillas
//.get pedir informacion
//.post dar informacion
//.listen escuchar a un puerto

//Midlewares, aquelos que usan .use, sirven para capas de seguridad o traduccion
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});