const pantalla = document.getElementById("pantalla");
const botones = document.querySelectorAll("button");

//Funcion para procesar valores de entrada
function procesarEntrada(valor) {
    let ultimo = pantalla.value.slice(-1)
    const operadores = ["+", "-", "/", "*"]
    if (pantalla.value.length === 0) {
        if ((operadores.includes(valor))||(valor === ".")) {
            return;
        }
    }
    if (operadores.includes(valor)&&(operadores.includes(ultimo))) {
        pantalla.value = pantalla.value.slice(0, -1) + valor
        return;
    }
    if ((valor === ".")&&(ultimo === ".")) {
        return;
    }
    if ((valor === ".")&&(operadores.includes(ultimo))) {
        return;
    }
    if (valor ===  "C") {
        pantalla.value = "";
    } else if ((valor === "=")||(valor === "Enter")) {
        pantalla.value = interpreteExpresiones(pantalla.value)
    } else if (valor == "Backspace") {
        pantalla.value = pantalla.value.slice(0,-1);
    } else {
        pantalla.value += valor;
    }
}

//Funcion para interpretar expresiones
function interpreteExpresiones(expresionBase) {
    if (!expresionBase) {
        console.error("Entrada invalida");
        return "Error";
    }
    let dividido = dividirExpresiones(expresionBase);
    let ordenado = ordenarExpresiones(dividido);
    let final = calcularFinal(ordenado);
    return final;
}

//Funcion para ordenar la lista de expresiones
function ordenarExpresiones(listaDeExpresiones) {
    let cajaOperadores = [];
    let cajaFinal = [];
    const jerarquia = {
        "+": "1",
        "-": "1",
        "*": "2",
        "/": "2"
    }
    // isNaN (isNotaNumber) si no es numero
    for (let expresion of listaDeExpresiones) {
        if (!isNaN(expresion)) {
            listaFinal.push(expresion);
        } 
        //Si la expresion es ( nomas la agrego
        else if (expresion === "(") {
            cajaOperadores.push(expresion);
        }
        //Si la expresion es ), la caja de operadores tiene cosas y el pasado no es un ( entonces empezamos a vaciar la caja hasta que llegamos al muro
        else if (expresion === ")") {
            while ((cajaOperadores > 0)&&((cajaOperadores.length - 1)!== "(")) {
                listaFinal.push(cajaOperadores.pop());
            }
            cajaOperadores.pop();
        }
        //Ahora hacemos con los operadores, si el operador que esta dentro es de mayor poder entonces ese pasa primero a la caja y se guardan
        //operadores que tienen menos poder ya que primero se ejecuta el fuerte, ya sea cuando entre uno mas fuerte que el debil o hasta el final
        //que vaciemos la caja saldra el debil
        else {
            while ((cajaOperadores > 0)&&((cajaOperadores.length - 1)!== "(")&&poder[cajaOperadores[cajaOperadores.length - 1]] >= poder[expresion]) {
                listaFinal.push(cajaOperadores.pop());
            }
            listaFinal.push(expresion);
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
function dividirExpresiones(expresion) {
    return expresion.match(/ (\d+\.?\d*) | [\+\-\*\/\(\))] /g);
    // \d+ busca numeros (0-9) puede ser uno o mas
    // \.? busca . puede estar o no estar
    // \d* si se cumple la condicion busca mas numeros
    // [] busca lo que sea que este aqui dentro 
    // \caracter busca ese caracter en especifico (solo busca uno en este caso)
    // / /g busca en toda la expresion, no solo cuando encuentre uno, sin eso al primero se para
    // .match() devuelve un array con coincidencias o un null si nada
}

function calcularFinal (listaFinal) {
    let pilaNumeros = [];
    //Si la expresion es un numero pasa a la pila de numeros
    for (expresion of listaFinal) {
        if (!isNaN(expresion)) {
            //parseFloat se asegura que con lo que trates sea doubles y no otros tipos de datos
            pilaNumeros.push(parseFloat(expresion));
        } else {
            //Si la expresion es un operador saco los dos valores numeros de la pila que esten mas arriba y les aplico el operador
            let numeroA = pilaNumeros.pop();
            let numeroB = pilaNumeros.pop();

            if (expresion === "+") pilaNumeros.push(numeroA + numeroB);
            if (expresion === "-") pilaNumeros.push(numeroA - numeroB);
            if (expresion === "*") pilaNumeros.push(numeroA * numeroB);
            if (expresion === "/") pilaNumeros.push(numeroA / numeroB);
        }
    }
    //Regresas el primer termino de la pila de abajo hacia arriba que realmente es el unico que hay
    return listaFinal[0];
}

//Poner cosas por mouse
botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const botonApretado = boton.textContent;
        procesarEntrada(botonApretado);
    })
})

//Poner cosas por teclado
document.addEventListener("keydown", (event) => {
    const tecla = event.key;
    const permitidas = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/", ".", "=", "C", "Backspace", "Enter", "(", ")"];
    if (permitidas.includes(tecla)) {
        procesarEntrada(tecla);
    }
})