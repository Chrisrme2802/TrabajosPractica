//Funcion que registra los errores que pasan en la pagina
//Importamos todo lo que necesitamos
const winston = require('winston');

//createLogger creas instancia de winston
const logger = winston.createLogger({
  level: 'info', // Tipo de mensajes que abarcara todo el logger en general, info captura todo (errores(exploto), warns(algo malo pero no rompe), info(normales), debug(detallado))
  format: winston.format.combine(   //Formato que manejara el logger, .combine() ya que uso mas de un formato a la vez
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),    //.timestamp() se encarga de agregar hora a cada evento
    winston.format.json() //.json() hace que cada linea sea un objeto, ideal para analizarlo
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),  //indico level entonces solamente se guardan errores
    new winston.transports.File({ filename: 'logs/combined.log' }),     //.transports.File lo escribe en un archivo en especifico, no indico level, se guarda todo
    //new winston.transports.Http(): Envía los logs a un servidor externo.
    //new winston.transports.MongoDB(): Guarda los logs directamente en una base de datos.
  ],
});

if (process.env.NODE_ENV !== 'production') {
  //.add() permite añadir destinos aun despues de crear el objeto de winston
  //.console() manda a stdout
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(), //Colorea errores, warns e info
      winston.format.simple()   //Estructura mas rapida y que abarca menos espacio en terminal
    ),
  }));
}

module.exports = logger;