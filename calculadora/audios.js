//Un diccionario con los audios
const audios = {
    fuerte: new Audio('assets/audios/Boton_fuerte.mp3'),
    debil: new Audio('assets/audios/Boton_debil.mp3')
};

//Funcion para reproducir sonidos (fuerte, debil)
export function reproducirBoton(tipo) {
    const sonido = audios[tipo];
    sonido.currentTime = 0;
    sonido.play().catch(error => {
        console.log("El navegador bloqueó el audio", error);
    });
}