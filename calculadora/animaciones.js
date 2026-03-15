import { gsap } from "https://esm.sh/gsap";

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