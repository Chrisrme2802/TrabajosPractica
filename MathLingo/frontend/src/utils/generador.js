  //Funcion para generarPreguntaNueva
  export const generarNuevaPregunta = (dificultad) => {
    const nuevaExpresion = elegirMolde(dificultad);
    return nuevaExpresion;
  };

  //Funcion que elige operador aleatorio
  const obtenerOperador = () => {
        //Todos los operadores que manejo
        const operadores = ['/', '*', '-', '+'];
        return operadores[Math.floor(Math.random() * operadores.length)];
    };

  //Funcion para que me de el molde ya con numeros y operadores
  const elegirMolde = (dificultad) => {
    //Primero declaramos los numeros que usaremos para que no truene
        const n1 = Math.floor(Math.random() * 20) + 1;
        const n2 = Math.floor(Math.random() * 20) + 1;
        const n3 = Math.floor(Math.random() * 20) + 1;
        const n4 = Math.floor(Math.random() * 20) + 1;
    
    //Elegimos el molde a usar
    const moldesNivel = {
        facil: [
            `${n1} ${obtenerOperador()} ${n2}`,
            `${n1} ${obtenerOperador()} ${n2} ${obtenerOperador()} ${n3}`
        ],
        intermedio: [
            `(${n1} ${obtenerOperador()} ${n2}) ${obtenerOperador()} ${n3}`,
            `${n1} ${obtenerOperador()} (${n2} ${obtenerOperador()} ${n3})`,
            `${n1} ${obtenerOperador()} ${n2} ${obtenerOperador()} ${n3} ${obtenerOperador()} ${n4}`
        ],
        dificil: [
            `(${n1} ${obtenerOperador()} ${n2}) ${obtenerOperador()} (${n3} ${obtenerOperador()} ${n4})`,
            `${n1} ${obtenerOperador()} (${n2} ${obtenerOperador()} ${n3} ${obtenerOperador()} ${n4})`,
            `(${n1} ${obtenerOperador()} ${n2} ${obtenerOperador()} ${n3}) ${obtenerOperador()} ${n4}`
        ]
    }
    const divisionDificultad = moldesNivel[dificultad];
    return divisionDificultad[Math.floor(Math.random() * divisionDificultad.length)];
  };
