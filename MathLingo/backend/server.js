//Importamos todo lo necesario para el server
//Trae y valida variables de entorno
require ('dotenv-safe').config();
const app = require('./app');
const logger = require('./middleware/logger');  

//Puerto
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    logger.info(`✅ Servidor corriendo en el puerto ${PORT} en modo ${process.env.NODE_ENV || 'development'}`);
});

//Global Unhandled Rejection Listener
//Listener global de node.js para eventos sincronos que causan errores
process.on('uncaughtException', (err) => {
    logger.error('💥 EXCEPCIÓN NO ATRAPADA (uncaughtException):', err);
    process.exit(1);
});

//Listener global de node.js para promesas (asincronas) que no se cumplen
process.on('unhandledRejection', (err) => {
    logger.error('💥 ERROR CRÍTICO (unhandledRejection):', err);
    console.log(err.name, err.message);
    //Graceful shutdown apaga el server de forma segura
    server.close(() => {
        //Cierra el proceso de node.js (1) es terminar porque algo salio mal, (0) es que todo termino perfecto
        process.exit(1);
    });
});