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

//Rutas bien del servidor
//Ruta pararecibir los datos de google
app.post('/auth/google', async (req, res) => {
    //Se abre el paquete que nos enviamos desde el frontend
    const { google_id, nombre, foto } = req.body;
    console.log(`Logeando a ${nombre} (${google_id})`);

    try {
        //Lo escribimos en la base de datos
        const query = '
        INSERT INTO usuarios (google_id, nombre, foto)
        VALUES ($1, $2, $3)
        ON CONFLICT (google_id)
        DO UPDATE SET
            nombre = EXCLUDED.nombre
            foto = EXCLUDED.foto
            RETURNING *;
        ';

        const values = [google_id, nombre, foto];
        const result = await pool.query(query, values);

        res.json({
            succes: true,
            usuario: result.rows[0]
        });
    }   catch (error) {
        console.error("Error en la base de datos:", err.mensaje);
        res.status(500).json({ error: "No se pudo procesar el Login "});
    }
})