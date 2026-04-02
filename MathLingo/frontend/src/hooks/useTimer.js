//El reloj que usa la app
import { useState, useEffect } from 'react';

    //Funciona como un constructor, a partir de este se haran los demas metodos
    export function useTimer(tiempoInicial, alTerminar) {

     const [tiempo, setTiempo] = useState(tiempoInicial);
     const [activo, setActivo] = useState(false);

  //useEffect que controla el tiempo
  useEffect(() => {
    let intervalo;
    if (activo && tiempo > 0) {
       intervalo = setInterval(() => {
      setTiempo(prev => prev - 1);
    }, 1000);
    } else if (tiempo === 0) {
      alTerminar();
      setActivo(false);
    }
    return () => clearInterval(intervalo);
  }, [tiempo, alTerminar, activo]);

  //Metodo para iniciar el cronometro
  const iniciarTiempo = () => {
    setTiempo(tiempoInicial);
    setActivo(true);
  }

  //Metodo para resetear el cronometro
  const resetearTiempo = () => setTiempo(tiempoInicial);

  //Metodo para añadir tiempo
  const añadirTiempo = (segundos) => {
    setTiempo(prev => {
        const nuevoTiempo = prev + segundos;
        return (nuevoTiempo > tiempoInicial)? tiempoInicial : nuevoTiempo;
  });
};  

  //Estoy regresando aquellos metodos que voy a poder llamar desde la otra clase
  return { tiempo, iniciarTiempo, resetearTiempo, añadirTiempo, setActivo, setTiempo }   
}
