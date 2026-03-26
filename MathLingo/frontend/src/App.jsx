import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useState, useRef } from "react"   //Metodo hook de react 
import './App.css'

function App() {

  //Primero se crean los estados de las cosas que usaremos
  const [num1, setNum1] = useState(0)    //Primero declaras y lo segundo es con lo que alteras su valor
  const [num2, setNum2] = useState(0)    //useState es lo que uso para darle valor a las cosas
  const [respuesta, setRespuesta] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [animacion, setAnimacion] = useState(false)

  const lottieRef = useRef(null);   //Es con lo que usaremos las animaciones, useRef

  //Funcion para comprobar respuesta
  const comprobarRespuesta = () => {
    if (parseInt(respuesta) === num1 + num2) {
      setMensaje('Correcto tilin');
      setMostrarCelebracion(true);
    } else {
      setMensaje('Hash fallado')
      setTimeout(() => {
          generarNuevaPregunta();
          setMostrarCelebracion(false);
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

}