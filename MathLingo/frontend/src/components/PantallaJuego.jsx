{/* Pantalla de juego HTML*/}
export function PantallaJuego ({ 
    expresion, 
    respuesta, 
    setRespuesta, 
    comprobarEstado, 
    tiempo, 
    progreso, 
    TOTAL_PREGUNTAS, 
    skips, 
    TOTAL_SKIPS, 
    mostrarBonus, 
    mensaje, 
    resultado, 
    digitosRevelados, 
    inputRef, 
    handleKeyDown 
    }) {
    return (
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
          <h2>{mensaje}</h2>
          <h3 className="expresion-matematica">{expresion}</h3>

      </main>
        {/* footer es aquello con lo que interactuamos */}
        {/* onChange es el escuchador de eventos de React, e es evento */}
        <footer className = "control-card">
          <div className="input-group" >
            <input 
            ref={inputRef}    
            className="input-respuesta"
            type="number" 
            placeholder="?"
            value={respuesta}
            onKeyDown={handleKeyDown} 
            onChange={(event) => setRespuesta(event.target.value)}         
            />
            <div className="pista-revelada">
              {/* .split('') me divide todo el String en un array con cada valor por separado */}
              {resultado.toString().split('').map((char, index) => (
                <span key={index} style={{ margin: '0 5px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {index < digitosRevelados? char : '_' }
                </span>
              ))}
            </div>
          </div>

        <button onClick={comprobarEstado} className="boton-comprobar">Comprobar</button> 

        <button className="boton-saltar" onClick={() => saltarPregunta() }>Saltar Pregunta</button>

        </footer>
        </div>
    </>
    );
}