import { interpreteExpresiones } from "./utils/interprete"
import { generarNuevaPregunta } from "./utils/generador"
import { useEffect, useState } from "react"   //Metodo hook y listener de React
import './App.css'
import './animations.css'

function App() {

  //Primero se crean los estados de las cosas que usaremos
  const [expresion, setExpresion] = useState('')    //Primero declaras y lo segundo es con lo que alteras su valor
  const [respuesta, setRespuesta] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [pantalla, setPantalla] = useState('menu'); // 'menu', 'juego', 'resultados' (cosas preevistas para estar)
  const [dificultadSeleccionada, setDificultadSeleccionada] = useState('facil');
  const [progreso, setProgreso] = useState(0);
  const [skips, setSkips] = useState(0);
  const [tiempo, setTiempo] = useState(30);
  const [mostrarBonus, setMostrarBonus] = useState(false);
  const TOTAL_PREGUNTAS = 10;
  const TOTAL_SKIPS = 3; 

  //useEffects() de la app
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

  //Funciones de la app
  //Funcion para reiniciar el juego
  const reiniciarJuego = () => {
    setProgreso(0);
    setTiempo(30);
    setSkips(0);
    setRespuesta('');
    setMensaje('¡Prepárate!');
    setPantalla('juego'); // Nos manda directo a jugar otra vez
    ponerNuevaPregunta();
  }

  //Funcion para volver al menu
  const volverAlMenu = () => {
  setTiempo(30);         
  setProgreso(0);        
  setPantalla('menu');   
};

  //Funcion para poner una pregunta
  const ponerNuevaPregunta = () => {
    const texto = generarNuevaPregunta(dificultadSeleccionada);
    setExpresion(texto);
    setRespuesta('');
    setMensaje('¿Cuál es el resultado?')
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
    const resultadoCorrecto = interpreteExpresiones(expresion)
    const resUsuario = parseFloat(parseFloat(respuesta).toFixed(2));
    const resSistema = parseFloat(resultadoCorrecto.toFixed(2));
    if (resUsuario === resSistema) {
      setMensaje('Correcto! ✨');
      setProgreso(prev => prev + 1);      //prev es como react se refiere a su estado anterior
      setTiempo(prev => Math.min(prev + 3, 30));    //para que no supere el maximo de 30
      setMostrarBonus(true);            //animacion del +3 con su tiempo
      setTimeout(() => setMostrarBonus(false), 1000);
    } else {
      setMensaje(`Incorrecto... el resultado era ${resSistema}`)
    }
    //Un tiempo para la siguiente pregunta
        setTimeout(() => {
        ponerNuevaPregunta();
      }, 2000);
    if (progreso === TOTAL_PREGUNTAS) {
      setMensaje(`¡Nivel Completado! 🏆`);
      setTimeout(() => setPantalla('resultados'), 3000);
    }
  }

  //Funcion para comenzar juego de cierta dificultad
  const empezarJuego = (nivel) => {
  setDificultadSeleccionada(nivel);
  setPantalla('juego');
  ponerNuevaPregunta();
};

  return (
  <div className="App">    {/* Todo tiene que ir encerrado en una division gigante (asi son los comentarios en html) */} 

      {/* Pantalla de menu */}
      {pantalla === 'menu' && (
        <div className="menu-principal">
          
          <h1>MathLingo</h1>

          <p>Elige tu desafío:</p>     {/* <p> parrafo </p> */}

          <div className="botones-dificultad">
            <button onClick={() => empezarJuego('facil')}>Nivel Básico</button>
            <button onClick={() => empezarJuego('intermedio')}>Nivel Medio</button>
            <button onClick={() => empezarJuego('dificil')}>Nivel Difícil</button>
          </div>

        </div>
      )}

      {/* Pantalla de juego */}
      {pantalla === 'juego' && (
    <>
        <header className="juego-header">
          <div className="header-izquierda">
            <span className="logo-chico">MathLingo</span>
          </div>
  
          <div className="header-centro">
            <div className="contenedor-progreso">
              <div className="barra-relleno" style={{ width: `${(progreso / TOTAL_PREGUNTAS) * 100}%` }}></div>
            </div>
          </div>

          <div className="header-derecha">
            <div className="stats">
              <span>⏭️ {TOTAL_SKIPS - skips}</span>
              <div className="tiempo-container">
                  <span>⏳ {tiempo}s</span>
                  {/* Si es true hazlo, si no, no */}
                  {mostrarBonus && <span className="bonus">+3</span>}
                </div>
            </div>
          </div>
        </header>
        <div className="juego-principal">

      {/* main es aquello que no tocamos */} 
      <main className = "information-card">
        {/* Se muestran los numeros con los que trataremos */}
        <div className="speech-bubble">
          <h2>{mensaje}</h2>
          <h3 className="expresion-matematica">{expresion}</h3>
        </div>

      </main>
        {/* footer es aquello con lo que interactuamos */}
        {/* onChange es el escuchador de eventos de React, e es evento */}
        <footer className = "control-card">
          <input 
          className="input-respuesta"
          type="number" 
          placeholder="?"
          value={respuesta} 
          onChange={(event) => setRespuesta(event.target.value)}         
        />

        <button onClick={comprobarEstado} className="boton-comprobar">Comprobar</button> 

        <button className="boton-saltar" onClick={() => saltarPregunta() }>Saltar Pregunta</button>

        </footer>
        </div>
    </>
      )}

    {/* Pantalla de resultados */}
    {pantalla === 'resultados' && (
      <div className="pantalla-resultados animacion-entrada">
          <header className="resultados-header">
          <h1>{progreso >= TOTAL_PREGUNTAS / 2 ? '¡Buen trabajo!' : '¡Sigue practicando!'}</h1>
          </header>

        <main className="resultados-principal">
          <div className="tarjeta-stats">
            <div className="stat-item">
              <span className="stat-label">Puntaje</span>
              <span className="stat-value">{progreso} / {TOTAL_PREGUNTAS}</span>
            </div>
            <div className="stat-item">
                <span className="stat-label">Precisión</span>
                <span className="stat-value">{Math.round((progreso / TOTAL_PREGUNTAS) * 100)}%</span>
            </div>
          </div>
        </main>

        <footer className="resultados-footer">
          <button className="boton-reintentar" onClick={reiniciarJuego}>Intentar de nuevo</button>
          <button className="boton-menu" onClick={volverAlMenu}>Volver al Menú</button>
        </footer>
      </div>
    )}

  </div>
  ); 
}

export default App;