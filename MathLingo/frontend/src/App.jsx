//Imports de HTML
import { PantallaMenu } from "./components/PantallaMenu";
import { PantallaJuego } from "./components/PantallaJuego";
import { PantallaResultados } from "./components/PantallaResultados";
import { UserBar } from "./components/UserBar";
//Imports de Utils
import { interpreteExpresiones } from "./utils/interprete"
import { generarNuevaPregunta } from "./utils/generador"
//Imports de Constants
import { GAME_CONFIG } from './constants/gameConfig';
//Imports de hooks
import { useTimer } from "./hooks/useTimer";
import { useUserStats } from "./hooks/useUserStats";
//Imports de React
import { useEffect, useState, useRef } from "react"   //Metodo hook y listener de React y referencia directa a espacio en pantalla
//Imports de CSS
import './App.css'
import './animations.css'

function App() {

  //Primero se crean los estados de las cosas que usaremos
  const inputRef = useRef(null);        //Declarar la referencia para poder marcar referencias a cosas depende la pantalla
  const [expresion, setExpresion] = useState('')    //Primero declaras y lo segundo es con lo que alteras su valor
  const [respuesta, setRespuesta] = useState('')
  const [resultado, setResultado] = useState('');
  const [mensaje, setMensaje] = useState('')
  const [pantalla, setPantalla] = useState('menu'); // 'menu', 'juego', 'resultados' (cosas preevistas para estar)
  const [dificultadSeleccionada, setDificultadSeleccionada] = useState('facil');
  const [dificultadActual, setDificultadActual] = useState('facil');
  const [progreso, setProgreso] = useState(0);
  const [skips, setSkips] = useState(0);
  const [mostrarBonus, setMostrarBonus] = useState(false);
  const [botonError, setBotonError] = useState(null);
  const [digitosRevelados, setDigitosRevelados] = useState(0);
  const [gananciasPartida, setGananciasPartida] = useState({monedas : 0, exp : 0});

  //Estados de los hooks
  //Funciones del useTimer
  const { tiempo, añadirTiempo, setActivo, resetearTiempo, setTiempo } = useTimer(
    GAME_CONFIG.TIEMPO_INICIAL, 
    () => setPantalla('resultados') //la nota de qué hacer al terminar
  );

  //Funciones del useUserStats
  const { desbloquearNivel, ganarRecompensas, stats, gastarMonedas } = useUserStats();

  //useEffects() de la app
  //useEffect para la victoria de cada nivel
  useEffect(() => {
  if (progreso === GAME_CONFIG.TOTAL_PREGUNTAS) {
    setMensaje(`¡Nivel Completado! 🏆 +50 🪙`);
    registrarGanancia(GAME_CONFIG.MONEDAS_POR_NIVEL, GAME_CONFIG.EXP_POR_NIVEL);
    
    // Bloqueamos el juego un momento para mostrar el éxito
    setTimeout(() => {
      setPantalla('resultados');
      setActivo(false);
    }, 2000);

    // Lógica de desbloqueo de niveles
    if (dificultadSeleccionada === 'facil') desbloquearNivel(2);
    if (dificultadSeleccionada === 'intermedio') desbloquearNivel(3);

  }
}, [progreso, dificultadSeleccionada]);

  //useEffect que controla el numero de digitos revelados
  useEffect(() => {
    if (pantalla === 'juego' && resultado !== '') {
      const resultadoStr = resultado.toString();
        if (digitosRevelados < resultadoStr.length) {
          const timer = setInterval(() => {
          setDigitosRevelados(prev => prev + 1);
          }, 3000);
          return () => clearInterval(timer);
        }
      }
  }, [digitosRevelados, pantalla, resultado]);

  //useEffect que manda focus al input en cada cambio de pregunta y pantalla juego
  useEffect(() => {
  if (pantalla === 'juego' && inputRef.current) {
    inputRef.current.focus();
  }
}, [expresion, pantalla]);

  //Funciones de la app
  //Funcion para detectar input por teclado para respuesta
  const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    comprobarEstado();
  }
};
  //Funcion para reiniciar el juego
  const reiniciarJuego = () => {
    setProgreso(0);
    resetearTiempo();
    setSkips(0);
    setRespuesta('');
    setMensaje('¡Prepárate!');
    setPantalla('juego'); // Nos manda directo a jugar otra vez
    ponerNuevaPregunta();
    setActivo(true);
  }

  //Funcion para volver al menu
  const volverAlMenu = () => {
  setTiempo(GAME_CONFIG.TIEMPO_INICIAL);         
  setProgreso(0);
  setSkips(0);        
  setPantalla('menu');   
};

  //Funcion para poner una pregunta
  const ponerNuevaPregunta = () => {
    const texto = generarNuevaPregunta(dificultadSeleccionada);
    setExpresion(texto);
    setRespuesta('');
    setDigitosRevelados(0);
    setMensaje('¿Cuál es el resultado?')

    const resultadoCalculado = interpreteExpresiones(texto);
    const resultadoFormateado = Number(resultadoCalculado.toFixed(2));
    setResultado(resultadoFormateado);
  }

  //Funcion para llevar la cuenta de recompensas de la partida
  const registrarGanancia = (monedasGanadas, expGanada) => {
    ganarRecompensas(monedasGanadas, expGanada);
    setGananciasPartida(prev => ({
      monedas : (prev?.monedas || 0) + monedasGanadas,
      exp : (prev?.exp || 0) + expGanada
    }));
  }

  //Funcion para saltar una pregunta
  const saltarPregunta = () => {
    if (skips < GAME_CONFIG.TOTAL_SKIPS) {
      setSkips(prev => prev + 1);
      ponerNuevaPregunta();
      setMensaje("¡Pregunta saltada! ⏩");    
    } else {
      setMensaje("¡Te quedaste sin saltos! 🚫");
    }
  }

  //Funcion para comprobar respuesta
  const comprobarEstado = () => {
    const resUsuario = parseFloat(parseFloat(respuesta).toFixed(2));
    const resSistema = parseFloat(resultado.toFixed(2));
    const diferencia = Math.abs(resUsuario - resSistema);
    const margenTolerancia = 0.11;
    if (diferencia <= margenTolerancia) {
      setMensaje('Correcto! ✨ +2 🪙');
      setProgreso(prev => prev + 1);      //prev es como react se refiere a su estado anterior
      setMostrarBonus(true);            //animacion del +3 con su tiempo
      añadirTiempo(GAME_CONFIG.BONUS_TIEMPO);
      registrarGanancia(GAME_CONFIG.MONEDAS_POR_ACIERTO, GAME_CONFIG.EXP_POR_ACIERTO);
    } else {
      setMensaje(`Incorrecto... el resultado era ${resSistema}`)
    }
    //Refresh de mostrarBonus
    setTimeout(() => {
      setMostrarBonus(false);
    }, 1000);
    //Un tiempo para la siguiente pregunta
      if (progreso + 1 < GAME_CONFIG.TOTAL_PREGUNTAS) {
    setTimeout(() => {
      ponerNuevaPregunta();
    }, 2000);
    }
  };

  //Funcion para comenzar juego de cierta dificultad
  const empezarJuego = (dificultadSeleccionada) => {
  setDificultadSeleccionada(dificultadSeleccionada);
  setPantalla('juego');
  ponerNuevaPregunta();
  setTiempo(GAME_CONFIG.TIEMPO_INICIAL);
  setActivo(true);
};

  //Funcion para revisar si puedes jugar un nivel
  const intentarJugar = (nivel, nivelDeNivel) => {
    if (stats.nivelesDesbloqueados < nivelDeNivel) {
      setBotonError(nivel); 
      setTimeout(() => setBotonError(null), 500);
      //alert("¡Nivel bloqueado! Completa el anterior."); tambien puedes mandar un alert (notificacion) 
      return;
    }
    empezarJuego(nivel);
};

  //Todo tiene que ir encerrado en una division gigante (asi son los comentarios en html)
  return (
  <div className="App">     

      <UserBar stats={stats} />

      {pantalla === 'menu' && (
        <PantallaMenu 
          empezarJuego={empezarJuego}
          intentarJugar={intentarJugar}
          nivelesDesbloqueados={stats.nivelesDesbloqueados}
          botonError={botonError}
        />
      )}

      {pantalla === 'juego' && (
        <PantallaJuego 
          expresion={expresion}
          respuesta={respuesta}
          setRespuesta={setRespuesta}
          comprobarEstado={comprobarEstado}
          tiempo={tiempo}
          progreso={progreso}
          TOTAL_PREGUNTAS={GAME_CONFIG.TOTAL_PREGUNTAS}
          skips={skips}
          TOTAL_SKIPS={GAME_CONFIG.TOTAL_SKIPS}
          mostrarBonus={mostrarBonus}
          mensaje={mensaje}
          resultado={resultado}
          digitosRevelados={digitosRevelados}
          inputRef={inputRef}
          handleKeyDown={handleKeyDown}
          saltarPregunta={saltarPregunta}
        />
      )}

      {pantalla === 'resultados' && (
        <PantallaResultados 
          progreso={progreso}
          TOTAL_PREGUNTAS={GAME_CONFIG.TOTAL_PREGUNTAS}
          reiniciarJuego={reiniciarJuego}
          volverAlMenu={volverAlMenu}
        />
      )}

  </div>
  ); 
}

export default App;