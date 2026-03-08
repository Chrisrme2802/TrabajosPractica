const pantalla = document.getElementById("pantalla");
const botones = document.querySelectorAll("button");
botones.forEach(boton => {
    boton.addEventListener("click", () => {
        pantalla.value += boton.textContent
    })
})