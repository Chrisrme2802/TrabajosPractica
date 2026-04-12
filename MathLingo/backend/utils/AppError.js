class AppError extends Error {
    constructor(message, statusCode) {
        super(message); //Llamamos al mensaje original

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // Indica que es un error previsto por nosotros

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;