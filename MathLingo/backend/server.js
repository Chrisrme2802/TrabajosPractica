//Importamos todo lo necesario para el server
const express = require('express');
const cors = require('cors');
const pool = require('./db');
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

//Rutas de autenticacion (logIn)
//Recibe los datos del logIn de google
app.post('/auth/google', async (req, res) => {
    //Se abre el paquete que nos enviamos desde el frontend
    const { google_id, nombre, foto_url } = req.body;
    console.log(`Logeando a ${nombre} (${google_id})`);

    try {
        //Lo escribimos en la base de datos
        const query = `
        INSERT INTO usuarios (google_id, nombre, foto_url)
        VALUES ($1, $2, $3)
        ON CONFLICT (google_id)
        DO UPDATE SET
            nombre = EXCLUDED.nombre,
            foto_url = EXCLUDED.foto_url
            RETURNING *;    
        `;
        //ON CONFLICT es de que ya existe el google_id, entonces el INSERT INTO no se puede realizar asi que pasamos a DO UPDATE SET
        //EXCLUDED es porque ya los intentaste escribir una vez, entonces ahora es con las cosas que no se pudieron escribir
        //Returning * es obligatorio para confirmar los datos
        //Values son espacios reservados que se llenan aqui (si importa el orden)
        const values = [google_id, nombre, foto_url];
        const result = await pool.query(query, values);

        res.json({
            success: true,
            usuario: result.rows[0]
        });
    }   catch (error) {
        console.error("Error en la base de datos:", error);
        res.status(500).json({ error: "No se pudo procesar el Login "});
    }
})

//Rutas de juego del servidor
//Actualiza monedas y exp en la base de datos
app.post('/auth/update-stats', async (req, res) => {
    const { google_id, monedas, experiencia } = req.body;
    try {
        const query = `
            UPDATE usuarios 
            SET monedas = $2, experiencia = $3 
            WHERE google_id = $1 
            RETURNING *;
        `;
        const values = [google_id, monedas, experiencia];
        const result = await pool.query(query, values);

        res.json({ success: true, usuario: result.rows[0] });
    } catch (error) {
        console.error("Error al actualizar stats:", error);
        res.status(500).json({ error: "Error de servidor al guardar progreso" });
    }
});

//Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});