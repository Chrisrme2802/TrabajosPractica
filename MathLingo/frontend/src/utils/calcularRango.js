//Valores disponibles
const LIMITES = {
    MAESTRO: 2000,
    ESTUDIANTE: 500,
    NOVATO: 0
};

//Son etiquetas @param: parametros  @returns: lo que regreso, se tienen que escribir de esta forma, regresar un objeto va con doble {{}}
/**
 * @param {number} exp
 * @returns {{nombre: string, color: string}}
 */

//Funcion que regresa un rango segun tu experiencia
export const calcularRango = (exp) => {
    if (exp >= LIMITES.MAESTRO) return { nombre: "MAESTRO", color: "#ff9600" };
    if (exp >= LIMITES.ESTUDIANTE) return { nombre: "ESTUDIANTE", color: "#58cc02" };
    return { nombre: "NOVATO", color: "#afafaf" };
};