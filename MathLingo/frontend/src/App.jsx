//Imports de HTML
import { PantallaMenu } from "./components/PantallaMenu";
import { PantallaJuego } from "./components/PantallaJuego";
import { PantallaResultados } from "./components/PantallaResultados";
//Imports de Utils
import { interpreteExpresiones } from "./utils/interprete"
import { generarNuevaPregunta } from "./utils/generador"
//Imports de Constants
import { GAME_CONFIG } from './constants/gameConfig';
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
  const [tiempo, setTiempo] = useState(GAME_CONFIG.TIEMPO_INICIAL);
  const [mostrarBonus, setMostrarBonus] = useState(false);
  const [nivelesDesbloqueados, setNivelesDesbloqueados] = useState(1);
  const [botonError, setBotonError] = useState(null);
  const [digitosRevelados, setDigitosRevelados] = useState(0);

  //useEffects() de la app
  //useEffect para la victoria de cada nivel
  useEffect(() => {
  if (progreso === TOTAL_PREGUNTAS) {
    setMensaje(`¡Nivel Completado! 🏆`);
    
    // Bloqueamos el juego un momento para mostrar el éxito
    setTimeout(() => {
      setPantalla('resultados');
    }, 2000);

    // Lógica de desbloqueo de niveles
    if (dificultadActual === 'facil' && nivelesDesbloqueados < 2) {
      setNivelesDesbloqueados(2);
      setDificultadActual('intermedio');
    } else if (dificultadActual === 'intermedio' && nivelesDesbloqueados < 3) {
      setNivelesDesbloqueados(3);
      setDificultadActual('dificil');
    }
  }
}, [progreso, TOTAL_PREGUNTAS]);

  //useEffect que controla el tiempo
  useEffect(() => {
    if ((pantalla === 'juego')&&(tiempo > 0)) {
      const timer = setInterval(() => {
      setTiempo(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
    } else if (tiempo === 0) {
      setMensaje("¡Se acabó el tiempo! ⏰");
      setPantalla('resultados');
    }
  }, [pantalla, tiempo]);

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
    setTiempo(GAME_CONFIG.TIEMPO_INICIAL);
    setSkips(0);
    setRespuesta('');
    setMensaje('¡Prepárate!');
    setPantalla('juego'); // Nos manda directo a jugar otra vez
    ponerNuevaPregunta();
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

  //Funcion para saltar una pregunta
  const saltarPregunta = () => {
    if (skips < TOTAL_SKIPS) {
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
      setMensaje('Correcto! ✨');
      setProgreso(prev => prev + 1);      //prev es como react se refiere a su estado anterior
      setTiempo(prev => Math.min(prev + GAME_CONFIG.BONUS_TIEMPO, GAME_CONFIG.TIEMPO_INICIAL));    //para que no supere el maximo de 30
      setMostrarBonus(true);            //animacion del +3 con su tiempo
      setTimeout(() => setMostrarBonus(false), 1000);
    } else {
      setMensaje(`Incorrecto... el resultado era ${resSistema}`)
    }
    //Un tiempo para la siguiente pregunta
        setTimeout(() => {
        ponerNuevaPregunta();
      }, 2000);
  }

  //Funcion para comenzar juego de cierta dificultad
  const empezarJuego = (nivel) => {
  setDificultadSeleccionada(nivel);
  setPantalla('juego');
  ponerNuevaPregunta();
};

  //Funcion para revisar si puedes jugar un nivel
  const intentarJugar = (nivel, nivelDeNivel) => {
    if (nivelesDesbloqueados < nivelDeNivel) {
      setBotonError(nivel); 
      setTimeout(() => setBotonError(null), 500);
      //alert("¡Nivel bloqueado! Completa el anterior."); tambien puedes mandar un alert (notificacion) 
      return;
    }
    empezarJuego(nivel);
};

  return (
  <div className="App">    {/* Todo tiene que ir encerrado en una division gigante (asi son los comentarios en html) */} 

      {pantalla === 'menu' && (
        <PantallaMenu 
          empezarJuego={empezarJuego}
          intentarJugar={intentarJugar}
          nivelesDesbloqueados={nivelesDesbloqueados}
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
          TOTAL_PREGUNTAS={TOTAL_PREGUNTAS}
          skips={skips}
          TOTAL_SKIPS={TOTAL_SKIPS}
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
          TOTAL_PREGUNTAS={TOTAL_PREGUNTAS}
          reiniciarJuego={reiniciarJuego}
          volverAlMenu={volverAlMenu}
        />
      )}

  </div>
  ); 
}

export default App;