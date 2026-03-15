import { UI } from './utils.js';
import { animarBoton, animarResultado } from './animaciones.js';
const { pantalla, botones } = UI;
const botonesArray = Array.from(botones);

//Funcion para procesar valores de entrada
function procesarEntrada(valor) {
    let ultimo = pantalla.value.slice(-1)
    const operadores = ["+", "-", "/", "*"]
    if (pantalla.value.length === 0) {
        if ((operadores.includes(valor))||(valor === ".")) {
            return;
        }
    }
    if ((pantalla.value === "Ingrese una expresion")||(pantalla.value === "Error")) {
        pantalla.value = "";
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
    if (valor ===  "AC") {
        pantalla.value = "";
    } else if ((!pantalla.value)&&(valor === "=")) {
        pantalla.value = "Ingrese una expresion";
    } else if (valor === "+/-") {
        if ((pantalla.value === "")||(pantalla.value === "Error")) {
            return;
        } 
        const regexUltimoNumero = /(-?\d+\.?\d*)$/;
        const coincidencia = pantalla.value.match(regexUltimoNumero);
        if (coincidencia) {
            let numeroEncontrado = coincidencia[0];
            let nuevoNumero;
            if (numeroEncontrado.startsWith("-")) {
                nuevoNumero = numeroEncontrado.slice(1);
        } else {
                nuevoNumero = "-" + numeroEncontrado;
        }
            pantalla.value = pantalla.value.replace(regexUltimoNumero, nuevoNumero);
            return; 
    }} else if (valor === "=") {
        let expresion = pantalla.value.replace(/\+\-/g, "-");
        expresion = expresion.replace(/(?<!\d)--/g, "+");
        let resultado = interpreteExpresiones(expresion);
        if (resultado === "Error") {
            animarResultado(pantalla, true);
        } else {
            animarResultado(pantalla, false);
        }
        pantalla.value = resultado;
    } else if ((valor === "Backspace")||(valor === "⌫")) {
        pantalla.value = pantalla.value.slice(0,-1);
    } else {
        pantalla.value += valor;
    }
}

//Funcion para interpretar expresiones
function interpreteExpresiones(expresionBase) {
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
function ordenarExpresiones(listaDeExpresiones) {
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
function dividirExpresiones(expresion) {
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

function calcularFinal (listaFinal) {
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

//Poner cosas por mouse
botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const botonApretado = boton.textContent;
        animarBoton(boton);
        procesarEntrada(botonApretado);
    })
})

//Poner cosas por teclado
document.addEventListener("keydown", (event) => {
    let tecla = event.key;
    if (tecla === "=" || tecla === "Enter") tecla = "=";
    if (tecla === "×" || tecla === "*") tecla = "*";
    if (tecla === "÷" || tecla === "/") tecla = "/";
    if (tecla === "Escape") tecla = "AC";
    const permitidas = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/", ".", "AC", "Backspace", "(", ")", "="];
    if (permitidas.includes(tecla)) {
        const botonReal = botonesArray.find(boton => boton.textContent === tecla);
        if (botonReal) animarBoton(botonReal);
        procesarEntrada(tecla);
    }
})

//Poder copiar y pegar cosas
document.addEventListener("keydown", async (event) => {
    const valoresAceptados = RegExp(/^[0-9+\-*/().]+$/);
    if ((event.ctrlKey)&&(event.key === 'v')) {
        event.preventDefault();
        try {
            const textoOriginal = await navigator.clipboard.readText();
            let textoLimpio = textoOriginal.replace(/\s+/g, '');

            if (valoresAceptados.test(textoLimpio)) {
                pantalla.value = textoLimpio;
            } else {
                pantalla.value = "Error";
            }
        } catch (e) {
            console.error("Error: ", e);
        }
    }
    if ((event.ctrlKey)&&(event.key === 'c')) {
        event.preventDefault();
        if (pantalla.value) {
            
        }
    }
})