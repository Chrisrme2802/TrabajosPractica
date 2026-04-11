//Definiciones de las rutas
//Aqui importo todo lo que ocupo para las rutas
const express = require('express');
//Importaciones de cosas de backend
const authController = require('../controllers/authController');
const { verificarToken } = require('../middleware/authMiddleware');
const { validarLogin, validarStats } = require('../middleware/validator');
//Instancio router mini aplicacion que controla middleware y rutas
const router = express.Router();

//Rutas
router.get('/verify', verificarToken, authController.verificarSesion);
router.post('/google', validarLogin, authController.loginGoogle);
router.post('/update-stats', verificarToken, validarStats, authController.updateStats);

module.exports = router;