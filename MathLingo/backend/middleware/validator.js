//Libreria de esquemas de validacion joi
//Importo lo que necesito aqui
const Joi = require('joi');

// Esquemas (moldes)
// Molde para el Login de Google
const loginSchema = Joi.object({
    google_id: Joi.string().required(),
    nombre: Joi.string().min(2).max(50).required(),
    foto_url: Joi.string().uri().allow(''), // Debe ser URL o estar vacío
    nivelesDesbloqueados: Joi.number().integer().min(1).default(1)
});

// Molde para las Estadísticas (Stats)
const statsSchema = Joi.object({
    monedas: Joi.number().integer().min(0).required(),
    experiencia: Joi.number().integer().min(0).required(),
    nivelesDesbloqueados: Joi.number().integer().min(1).required()
});

// Función técnica que valida (Middleware)
const validarCuerpo = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            //El error especifico
            console.log("DETALLE DEL ERROR JOI:", error.details[0].message);
            // Error 400 bad request, solicitud mal hecha por parte del cliente
            return res.status(400).json({ error: error.details[0].message });
        }
        next();
    };
};

module.exports = {
    validarLogin: validarCuerpo(loginSchema),
    validarStats: validarCuerpo(statsSchema)
};