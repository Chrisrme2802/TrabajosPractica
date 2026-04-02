{/* Pantalla de resultados HTML*/}
export function PantallaResultados ({
  progreso, 
  TOTAL_PREGUNTAS, 
  reiniciarJuego, 
  volverAlMenu
}) {
    const mensajeFinal = (progreso >= TOTAL_PREGUNTAS / 2) ? '¡Buen trabajo!' : '¡Sigue practicando!';
    const precision = Math.round((progreso / TOTAL_PREGUNTAS) * 100);

    return (
        <div className="pantalla-resultados animacion-entrada">
          <header className="resultados-header">
          <h1>{mensajeFinal}</h1>
          </header>

        <main className="resultados-principal">
          <div className="tarjeta-stats">
            <div className="stat-item">
              <span className="stat-label">Puntaje</span>
              <span className="stat-value">{progreso} / {TOTAL_PREGUNTAS}</span>
            </div>
            <div className="stat-item">
                <span className="stat-label">Precisión</span>
                <span className="stat-value">{precision}%</span>
            </div>
          </div>
        </main>

        <footer className="resultados-footer">
          <button className="boton-reintentar" onClick={reiniciarJuego}>Intentar de nuevo</button>
          <button className="boton-menu" onClick={volverAlMenu}>Volver al Menú</button>
        </footer>
      </div>
    ); 
}