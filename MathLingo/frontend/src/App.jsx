import { interpreteExpresiones } from "./utils/interprete"
import { generarNuevaPregunta } from "./utils/generador"
import { useState } from "react"   //Metodo hook de react  
import './App.css'

function App() {

  //Primero se crean los estados de las cosas que usaremos
  const [expresion, setExpresion] = useState(0)    //Primero declaras y lo segundo es con lo que alteras su valor
  const [respuesta, setRespuesta] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [pantalla, setPantalla] = useState('menu'); // 'menu', 'juego', 'resultados' (cosas preevistas para estar)
  const [dificultadSeleccionada, setDificultadSeleccionada] = useState('facil');
  const [progreso, setProgreso] = useState(0);
  const TOTAL_PREGUNTAS = 10; 

  //Funciones de la app
  //Funcion para comprobar respuesta
  const comprobarEstado = () => {
    const resultadoCorrecto = interpreteExpresiones(expresion)
    if (parseInt(respuesta) === resultadoCorrecto) {
      setMensaje('Correcto! ✨');
      setProgreso(prev => prev + 1);      //prev es como react se refiere a su estado anterior
    } else {
      setMensaje('Incorrecto... el resultado era ${resultadoCorrecto}')
    }
    //Un tiempo para la siguiente pregunta
        setTimeout(() => {
        generarNuevaPregunta(dificultadSeleccionada);
      }, 2000);
    if (progreso = TOTAL_PREGUNTAS) {
      setMensaje("¡Nivel Completado! 🏆");
      setTimeout(() => setPantalla('menu'), 3000);
    }
  }

  //Funcion para comenzar juego de cierta dificultad
  const empezarJuego = (nivel) => {
  setDificultadSeleccionada(nivel);
  setPantalla('juego');
  const primeraPregunta = elegirMolde(nivel); 
  setExpresion(primeraPregunta); 
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
        <div className="juego-principal">
          <div className="progress-container">
          <div className="progress-fill" style={{ width: `${progreso / TOTAL_PREGUNTAS * 100}%` }}></div>
      </div>

      {/* main es aquello que no tocamos */} 
      <main className = "information-card">
        {/* Se muestran los numeros con los que trataremos */}
        <div className="speech-bubble">
          <h2>${mensaje}</h2>
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

        </footer>
        </div>
      )}

        </div>
  ); 
}

export default App;