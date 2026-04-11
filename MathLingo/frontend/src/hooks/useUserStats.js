//El LocalStorage de la app
import { useState, useEffect } from 'react';

    //Stats iniciales de una cuenta
    const STATS_INICIALES = {
      nivelesDesbloqueados: 1,
      monedas: 0,
      experiencia: 0,
      nombre: "",
      foto: null,
      googleID: null,
      racha: 0
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
    }, [stats.monedas, stats.experiencia, stats.nivelesDesbloqueados]); //Se actualizara solamente cuando cambien estos valores para evitar bucles

    //Metodo para actualizar las stats en la base de datos
    const sincronizarConDB = async (nuevosStats) => {
    const token = localStorage.getItem('token_mathlingo');
    try {
        const respuesta = await fetch('http://localhost:5000/auth/update-stats', {
            method: 'POST',
            headers:  {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                monedas: Number(nuevosStats.monedas) || 0,
                experiencia: Number(nuevosStats.experiencia) || 0,
                nivelesDesbloqueados: Number(nuevosStats.nivelesDesbloqueados) || 1
            })
        });
    if (respuesta.ok) {
        const datosRespuesta = await respuesta.json();
        const datosUsuario = datosRespuesta.usuario;
        setStats(prev => ({
            ...prev,
            monedas: datosUsuario.monedas,
            experiencia: datosUsuario.experiencia,
            nivelesDesbloqueados: datosUsuario.nivel_desbloqueado,
            racha: datosUsuario.racha_actual
        }));
    }
    } catch (error) {
        console.error("No se pudo sincronizar con la DB", error);
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