//El LocalStorage de la app
import { useState, useEffect } from 'react';

    //Stats iniciales de una cuenta
    const STATS_INICIALES = {
      nivelesDesbloqueados: 1,
      monedas: 0,
      experiencia: 0,
      rango: 'Principiante'
    };  

    //Constructor principal de las estadisticas
    export function useUserStats() {
        const [stats, setStats] = useState(() => {
            const datosGuardados = localStorage.getItem('mathlingo_stats');
            //Si existe solamente lo pasamos a String lo que haya en datos guardados (JSON)
            return datosGuardados? JSON.stringify(datosGuardados) : STATS_INICIALES;
        });

    //useEffect para actualizar el nivel cada que nivelesDesbloqueados cambie
    useEffect(() => {
        localStorage.setItem('mathlingo_stats', JSON.stringify(stats));
        }, [stats]);

    //Metodo para poder desbloquear niveles
    const desbloquearNivel = ((nivel) => {
        setStats(prev => {
            if (nivel > prev.nivelesDesbloqueados) { 
                return {
                    ...prev,            //Aqui digo, copia todo lo demas de prev, solamente cambia nivelesDesbloqueados
                    nivelesDesbloqueados : nivel
                };
            }
            return prev;
        })
    })

    //Metodo para ganar recompensas (monedas y exp)
    const ganarRecompensas = ((monedasNuevas, expNueva) => {
        setStats(prev => ({
            ...prev,
            monedas : prev.monedas + monedasNuevas,
            experiencia : prev.experiencia + expNueva
        }));
    })

    //Metodo para gastar monedas
    const gastarMonedas = (monedasGastadas) => {
        if (monedasGastadas <= stats.monedas) {
            setStats(prev => ({
                ...prev,
                monedas : monedas - monedasGastadas
            }));
            return true;
        } 
            return false;
    }

    //Regreso las cosas que puedo mandar a llamar desde fuera
    return { desbloquearNivel, stats, ganarRecompensas, gastarMonedas };
}