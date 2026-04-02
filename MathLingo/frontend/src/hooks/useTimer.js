//El reloj que usa la app
import { useState, useEffect } from 'react';

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

  const iniciarTiempo = () => {
    setTiempo(tiempoInicial);
    setActivo(true);
  }

  const resetearTiempo = () => setTiempo(tiempoInicial);

  const añadirTiempo = (segundos) => {
    setTiempo(prev => {
        const nuevoTiempo = prev + segundos;
        return (nuevoTiempo > tiempoInicial)? tiempoInicial : nuevoTiempo;
  });
};  

  return { tiempo, iniciarTiempo, resetearTiempo, añadirTiempo, setActivo, setTiempo }   
}
