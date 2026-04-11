//Funcion que se ejecuta entre medio de un req y un res
//Importamos las cosas que necesitamos
const jwt = require('jsonwebtoken');

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
module.exports = { verificarToken };