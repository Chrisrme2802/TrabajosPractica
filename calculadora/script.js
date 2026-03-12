const pantalla = document.getElementById("pantalla");
const botones = document.querySelectorAll("button");

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
        pantalla.value = eval(pantalla.value)
    } else if (valor == "Backspace") {
        pantalla.value = pantalla.value.slice(0,-1);
    } else {
        pantalla.value += valor;
    }
}

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const botonApretado = boton.textContent;
        procesarEntrada(botonApretado);
    })
})

document.addEventListener("keydown", (event) => {
    const tecla = event.key;
    const permitidas = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/", ".", "=", "C", "Backspace", "Enter"];
    if (permitidas.includes(tecla)) {
        procesarEntrada(tecla);
    }
})