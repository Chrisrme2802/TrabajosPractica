import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useState, useRef, useEffect } from "react"   //Metodo hook de react 
import AnimacionCelebracion  from './assets\animaciones\AnimacionCelebracion.lottie'; 
import './App.css'

function App() {

  //Primero se crean los estados de las cosas que usaremos
  const [num1, setNum1] = useState(0)    //Primero declaras y lo segundo es con lo que alteras su valor
  const [num2, setNum2] = useState(0)    //useState es lo que uso para darle valor a las cosas
  const [respuesta, setRespuesta] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [celebracion, setCelebracion] = useState(false)

  const lottieRef = useRef(null);   //Es con lo que usaremos las animaciones, useRef

  //Funcion para comprobar respuesta
  const comprobarRespuesta = () => {
    if (parseInt(respuesta) === num1 + num2) {
      setMensaje('Correcto tilin');
      setCelebracion(true);
    } else {
      setMensaje('Hash fallado')
      setTimeout(() => {
          generarNuevaPregunta();
          setCelebracion(false);
      }, 2000);
    }
  }

  //Funcion para generarPreguntaNueva
  const generarNuevaPregunta = () => {
    setNum1(Math.floor(Math.random() * 10));
    setNum2(Math.floor(Math.random() * 10));
    setRespuesta('');
    setMensaje('Cuanto es?');
  };

  //Funcion para abrir pregunta apenas se abra la pagina
  useEffect(() => {
    generarNuevaPregunta();
    console.log("Se genero pregunta al ejecutar");
  }, []);                 //Los corchetes manejan la variable que activara a la funcion, si no hay nada se ejecutara al inicializar la app

  return (
    <div className="App">    {/* Todo tiene que ir encerrado en una division gigante (asi son los comentarios en html) */} 
      <h1>{mensaje}</h1>

      <div className = "card-operacion">
        {/* Se muestran los numeros con los que trataremos */}
        <span className="numero">{num1}</span>
        <span className="operador">+</span>         {/* span es lo que se usa para que todo este en una sola linea */}
        <span className="numero">{num2}</span>
        <span className="operador">=</span> 

        {/* onChange es el escuchador de eventos de React, e es evento */}
        <input 
          className="input-respuesta"
          type="number" 
          placeholder="?"
          value={respuesta} 
          onChange={(e) => setRespuesta(e.target.value)}         
        />
        </div>

        <button onClick={comprobarRespuesta} className="boton-comprobar"> </button>

        {celebracion && (
        <div className="overlay-lottie">
          <DotLottieReact
            src={AnimacionCelebracion}
            dotLottieRefCallback={(dotLottie) => {
              lottieRef.current = dotLottie;
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}
    </div> 
  ); 
}

export default App;