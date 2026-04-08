//Importamos todo lo necesario para el server
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const jwt = require('jsonwebtoken');
require ('dotenv').config();

//Instancio app con la libreria express para temas de enrutamiento
const app = express();

//.set para usar motor de plantillas
//.get pedir informacion
//.post dar informacion
//.listen escuchar a un puerto

//Midlewares, aquelos que usan .use, sirven para capas de seguridad o traduccion
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    //Variaciones: unsafe-none (defecto): permite cualquier cosa es menos seguro
    //same-origin: Cualquier pop up externo a la pagina la rompe, no puedes usar logins externos
    //same-origin-allow-popups: Aisla de otras pestañas, pero los pop ups que tu abriste si los deja pasar
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

//Funcion verificar token
//El next se usa en metodos dentro de otros metodos, sin este no sigue corriendo (verificaciones mayormente)
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Separamos "[Bearer],[TOKEN]"

    if (!token) {
        //Error 401 es falta de cosa para autenticar credenciales
        return res.status(401).json({ error: "No hay token, acceso denegado" });
    }

    try {
        const cifrado = jwt.verify(token, process.env.JWT_SECRET);
        //Creo en request una propiedad del objeto
        req.user = cifrado;
        next();
    } catch (error) {
        //Error 403 es denegacion por credenciales distintas o expiradas
        res.status(403).json({ error: "Token no válido o expirado" });
    }
};

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
//Ruta para recuperar sesion inciada
app.get('/auth/verify', verificarToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE google_id = $1', 
            [req.user.google_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ success: true, usuario: result.rows[0] });
    } catch (error) {
        //Error al procesar una solicitud (general)
        res.status(500).json({ error: "Error al verificar sesión" });
    }
});
//Recibe los datos del logIn de google
app.post('/auth/google', async (req, res) => {
    //Se abre el paquete que nos enviamos desde el frontend
    const { google_id, nombre, foto_url, nivelesDesbloqueados } = req.body;
    console.log(`Logeando a ${nombre} (${google_id})`);

    try {
        //Lo escribimos en la base de datos
        const query = `
        INSERT INTO usuarios (google_id, nombre, foto_url, nivel_desbloqueado)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (google_id)
        DO UPDATE SET
            nombre = EXCLUDED.nombre,
            foto_url = EXCLUDED.foto_url,
            nivel_desbloqueado = EXCLUDED.nivel_desbloqueado
            RETURNING *;    
        `;
        //ON CONFLICT es de que ya existe el google_id, entonces el INSERT INTO no se puede realizar asi que pasamos a DO UPDATE SET
        //EXCLUDED es porque ya los intentaste escribir una vez, entonces ahora es con las cosas que no se pudieron escribir
        //Returning * es obligatorio para confirmar los datos
        //Values son espacios reservados que se llenan aqui (si importa el orden)
        const values = [google_id, nombre, foto_url, nivelesDesbloqueados];
        const result = await pool.query(query, values);
        //Es el objeto que regreso con todas las stats
        const usuario = result.rows[0];

        //Generamos el webToken
        const token = jwt.sign(
                //Este es el atributo que tendra user, luego de descifrarlo
                { google_id: usuario.google_id }, 
                process.env.JWT_SECRET, 
                { expiresIn: '7d' } // El gafete dura 7 días
        );

        res.json({
            success: true,
            usuario: usuario,
            token: token
        });
    }   catch (error) {
        console.error("Error en la base de datos:", error);
        res.status(500).json({ error: "No se pudo procesar el Login "});
    }
})

//Rutas de juego del servidor
//Actualiza monedas y exp en la base de datos
app.post('/auth/update-stats', verificarToken, async (req, res) => {
    const idDelToken = req.user.google_id;
    const { monedas, experiencia, nivelesDesbloqueados } = req.body;

    try {
        const query = `
            UPDATE usuarios 
            SET monedas = $2, experiencia = $3, nivel_desbloqueado = $4
            WHERE google_id = $1 
            RETURNING *;
        `;
        const values = [idDelToken, monedas, experiencia, nivelesDesbloqueados];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

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