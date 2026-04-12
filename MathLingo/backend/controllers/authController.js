
//Importamos las cosas que necesitamos
const pool = require('../db');
const jwt = require('jsonwebtoken');
const logger = require('../middleware/logger');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/CatchAsync');

//Recibe los datos del logIn de google
exports.loginGoogle =  catchAsync (async (req, res, next) => {
    //Se abre el paquete que nos enviamos desde el frontend
    const { google_id, nombre, foto_url, nivelesDesbloqueados } = req.body;

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

        logger.info(`Cuenta loggeada para usuario: ${google_id}`);

        res.json({
            success: true,
            usuario: usuario,
            token: token
        });
});

//Ruta para recuperar sesion inciada
exports.verificarSesion = catchAsync (async (req, res, next) => {
    const idDelToken = req.user.google_id;
        // Limpiamos desde que iniciamos sesion la racha
        const limpiaRachaQuery = `
            UPDATE usuarios 
            SET racha_actual = 0 
            WHERE google_id = $1 
            AND ultima_conexion < CURRENT_DATE - INTERVAL '1 day'
        `;
        await pool.query(limpiaRachaQuery, [req.user.google_id]);

        const result = await pool.query(
            'SELECT * FROM usuarios WHERE google_id = $1', 
            [req.user.google_id]
        );

        if (result.rows.length === 0) {
            return next(new AppError('Usuario no encontrado en la base de datos', 404));
        }

        logger.info(`Cuenta recuperada para usuario: ${idDelToken}`);
        res.status(200).json({ success: true, usuario: result.rows[0] });
});


//Actualiza estadisticas en la base de datos
exports.updateStats = catchAsync (async (req, res) => {
    const idDelToken = req.user.google_id;
    const { monedas, experiencia, nivelesDesbloqueados } = req.body;

        const query = `
            UPDATE usuarios 
                SET monedas = $2, 
                experiencia = $3, 
                nivel_desbloqueado = $4,
                racha_actual = CASE 
                    WHEN ultima_conexion IS NULL OR racha_actual = 0 THEN 1
                    WHEN ultima_conexion::DATE = (CURRENT_DATE - INTERVAL '1 day')::DATE THEN racha_actual + 1
                    WHEN ultima_conexion::DATE = CURRENT_DATE THEN racha_actual
                    ELSE 1 
                END,
                ultima_conexion = CURRENT_DATE
                WHERE google_id = $1 
            RETURNING *;
        `;
        const values = [idDelToken, monedas, experiencia, nivelesDesbloqueados];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return next(new AppError('Usuario no encontrado en la base de datos', 404));
        }

        logger.info(`Stats actualizados para usuario: ${idDelToken}`);
        res.status(200).json({ success: true, usuario: result.rows[0] });
});