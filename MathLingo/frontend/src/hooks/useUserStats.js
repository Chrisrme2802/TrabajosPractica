//El LocalStorage de la app
import { useState, useEffect } from 'react';

    //Stats iniciales de una cuenta
    const STATS_INICIALES = {
      nivelesDesbloqueados: 1,
      monedas: 0,
      experiencia: 0,
      nombre: "",
      foto: null,
      googleID: null
    };  

    //Constructor principal de las estadisticas
    export function useUserStats() {
        const [stats, setStats] = useState(() => {
            const datosGuardados = localStorage.getItem('mathlingo_stats');
            //Si existe solamente lo pasamos a String lo que haya en datos guardados (JSON)
            return datosGuardados? JSON.parse(datosGuardados) : STATS_INICIALES;
        });

    //useEffect para actualizar las stats cada que stats cambie
    useEffect(() => {
        localStorage.setItem('mathlingo_stats', JSON.stringify(stats));
        if (stats.googleID) {
            sincronizarConDB(stats);
        }
    }, [stats]);

    //Metodo para actualizar las stats en la base de datos
    const sincronizarConDB = async (nuevosStats) => {
    try {
        await fetch('http://localhost:5000/auth/update-stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                google_id: nuevosStats.googleID,
                monedas: nuevosStats.monedas,
                experiencia: nuevosStats.experiencia,
                nivelesDesbloqueados: nuevosStats.nivelesDesbloqueados
            })
        });
    } catch (err) {
        console.error("No se pudo sincronizar con la DB", err);
    }
};

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
            monedas : (Number(prev.monedas) || 0) + monedasNuevas,
            experiencia : (Number(prev.experiencia) || 0) + expNueva
        }));
    })

    //Metodo para gastar monedas
    const gastarMonedas = (monedasGastadas) => {
        if (monedasGastadas <= stats.monedas) {
            setStats(prev => ({
                ...prev,
                monedas : prev.monedas - monedasGastadas
            }));
            return true;
        } 
            return false;
    }

    //Regreso las cosas que puedo mandar a llamar desde fuera
    return { desbloquearNivel, stats, ganarRecompensas, gastarMonedas, setStats };
}