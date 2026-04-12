//Modulo ya que es una sola function en todo el archivo, es la que me ahorra poner try/catch
//Ocupa una fn (function) para funcionar
module.exports = fn => {
    //Lo ejecuta en un piso abajo para evitar que truene
    return (req, res, next) => {
        fn(req, res, next).catch(next); // Si cacha un next es que es un error, los next generales mandan al middleware global (4 parametros)
    };
};