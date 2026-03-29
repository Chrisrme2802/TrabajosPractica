//Funcion para interpretar expresiones
export const interpreteExpresiones = (expresionBase) => {
    //Validacion de que haya expresion
    if (!expresionBase) {
        console.error("Entrada invalida");
        return "Error";
    }

    let dividido = dividirExpresiones(expresionBase);
    //Validacion de que la expresion sea valida
    if (!dividido) {
        console.error("No se puede dividir la expresion, formato invalido");
        return "Error";
    }
    let ordenado = ordenarExpresiones(dividido);
    let final = calcularFinal(ordenado);
    return final;
}

//Funcion para ordenar la lista de expresiones
const ordenarExpresiones = (listaDeExpresiones) => {
    let cajaOperadores = [];
    let listaFinal = [];
    const jerarquia = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2
    }
    // isNaN (isNotaNumber) si no es numero (Es algo fragil)
    const patronAnclaje = /^\d+\.?\d*$/; //Patron pero con ^ $ ya que va a ir en un array no en una cadena
    for (let expresion of listaDeExpresiones) {
        if (patronAnclaje.test(expresion)) {        //.test() valida una expresion con base de un molde
            console.log("Procesando:", expresion, " | Caja actual:", cajaOperadores);
            listaFinal.push(expresion);
        } 
        //Si la expresion es ( nomas la agrego
        else if (expresion === "(") {
            cajaOperadores.push(expresion);
        }
        //Si la expresion es ), la caja de operadores tiene cosas y el pasado no es un ( entonces empezamos a vaciar la caja hasta que llegamos al muro
        else if (expresion === ")") {
            while ((cajaOperadores.length > 0)&&((cajaOperadores[cajaOperadores.length - 1])!== "(")) {
                listaFinal.push(cajaOperadores.pop());
            }
            cajaOperadores.pop();
        }
        //Ahora hacemos con los operadores, si el operador que esta dentro es de mayor poder entonces ese pasa primero a la caja y se guardan
        //operadores que tienen menos poder ya que primero se ejecuta el fuerte, ya sea cuando entre uno mas fuerte que el debil o hasta el final
        //que vaciemos la caja saldra el debil
        else if (['-', '+', '/', '*'].includes(expresion)) {
            while ((cajaOperadores.length > 0)&&((cajaOperadores.length - 1) !== "(")&&(jerarquia[cajaOperadores[cajaOperadores.length - 1]] >= jerarquia[expresion])) {
                console.log("Procesando:", expresion, " | Caja actual:", cajaOperadores);
                listaFinal.push(cajaOperadores.pop());
            }
            cajaOperadores.push(expresion);
            console.log("operador guardado en caja: " + expresion);
        }
    }
        //Ya que acabamos de revisar todas las piezas terminamos de validar que si que dejamos totalmente vacia la caja de operadores
        //para evitar perder algun elemento
        while (cajaOperadores.length > 0) {
            listaFinal.push(cajaOperadores.pop());
    }
    return listaFinal;
}

//Funcion dividir expresiones en terminos
const dividirExpresiones = (expresion) => {
    const patronGlobal = /(\d+\.?\d*)|[\+\-\*\/\(\))]/g; //De esta forma estas creando un constructor de regex para usar en cualquier momento (RegExp())
    return expresion.match(patronGlobal);
    //  return expresion.match(/(\d+\.?\d*)|[\+\-\*\/\(\))]/g); Esta es una manera simple de hacer lo mismo
    // \d+ busca numeros (0-9) puede ser uno o mas
    // \.? busca . puede estar o no estar
    // \d* si se cumple la condicion busca mas numeros
    // [] busca lo que sea que este aqui dentro 
    // \caracter busca ese caracter en especifico (solo busca uno en este caso)
    // / /g busca en toda la expresion, no solo cuando encuentre uno, sin eso al primero se para, y busca en cadenas no en arrays
    // .match() devuelve un array con coincidencias o un null si nada
}

//Mete todo en un resultado final
const calcularFinal = (listaFinal) => {
    let pilaNumeros = [];
    //Si la expresion es un numero pasa a la pila de numeros
    for (let expresion of listaFinal) {
        if (!isNaN(expresion)) {
            //parseFloat se asegura que con lo que trates sea doubles y no otros tipos de datos
            pilaNumeros.push(parseFloat(expresion));
        } else {
            //Si la expresion es un operador saco los dos valores numeros de la pila que esten mas arriba y les aplico el operador
            let numeroA = pilaNumeros.pop();
            let numeroB = pilaNumeros.pop();

            if (expresion === "+") pilaNumeros.push(numeroA + numeroB);
            if (expresion === "-") pilaNumeros.push(numeroB - numeroA);
            if (expresion === "*") pilaNumeros.push(numeroA * numeroB);
            if (expresion === "/") pilaNumeros.push(numeroB / numeroA);
        }
    }
    //Regresas el primer termino de la pila de abajo hacia arriba que realmente es el unico que hay
    return pilaNumeros[0];
}