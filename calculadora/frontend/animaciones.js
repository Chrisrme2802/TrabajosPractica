import { gsap } from "https://esm.sh/gsap";
import { UI } from './utils.js';
const { pantalla, botones } = UI;

//Funcion para animar clicks a los botones
export function animarBoton(boton) {
    gsap.to(boton, {
        scale: 0.9,
        duration: 0.1,
        repeat: 1,      // Se ejecuta una vez y se repite
        yoyo: true,     // Al repetirse, se reproduce al revés (regresa a 1)    
        ease: "power2.out" 
    });
    //"power2.out" comienza rapido y acaba lento
    //"power1.in" Empieza lento y acelera al final
    //"back.out(2)" El botón se encoge, pero al final da un pequeño rebote hacia afuera
    //"bounce.out" El botón rebota como una pelota al llegar a su tamaño final
}
//Funcion para correcto e incorrecto
export function animarResultado(elemento, esError = false) {
    const timeline = gsap.timeline();

    // 1. Efecto inicial (Rojo si es error, Verde si es correcto)
    timeline.to(elemento, {
        backgroundColor: esError ? "#e6a9ae" : "#a4e7b4",
        color: esError ? "#721c24" : "#155724",
        duration: 0.2
    })
    // 2. Un pequeño movimiento
    .to(elemento, { x: esError ? 5 : 0, scale: esError ? 1 : 1.02, duration: 0.1, repeat: esError ? 3 : 0, yoyo: true })
    
    // 3. Reset
    .to(elemento, {
        backgroundColor: "#f0f0f0", 
        color: "#333",              
        scale: 1,
        x: 0,
        duration: 0.3,
        ease: "power1.inOut"
    });
}
//Funcion para borrar con Backspace
export function borrarUltimo() {
    // Añadimos la clase para que inicie la animación inicia la escena
    pantalla.classList.add('animar-borrado');
        if (pantalla.value === "") {    return; }
    // Esperamos a que la animación termine (0.2s lo mismo que la animacion = 200 ms) para borrar el contenido
    setTimeout(() => {
        pantalla.value = pantalla.value.slice(0, -1);
        
        // Se quita la clase para que pueda volver a animarse después y que pues ya se acabe
        pantalla.classList.remove('animar-borrado');
    }, 100);
}
//Funcion para copiar y pegar
export function dispararAnimacion(elemento) {
    // Agregamos la clase
    elemento.classList.add('input-activo');
    
    // Quitamos la clase después de 300ms (lo mismo que tu transición CSS)
    setTimeout(() => {
        elemento.classList.remove('input-activo');
    }, 300);
}