{/* Pantalla de menu HTML*/}
export function PantallaMenu ({
  usuario,
  cerrarSesion,
  empezarJuego, 
  intentarJugar, 
  nivelesDesbloqueados, 
  botonError
}) {
    return (
        <div className="menu-principal">
            <div className="perfil-esquina">
                  <span className="perfil-nombre">{usuario.name}</span>
                  <img 
                    src={usuario.picture} 
                    alt="Foto de perfil" 
                    className="perfil-foto"
                    referrerPolicy="no-referrer" /* Importante para que carguen las fotos de Google */
                  />
                  <button onClick={cerrarSesion} className="boton-logout">
                    Salir
                  </button>
            </div>
          <div className="header-menu">

          <h1 className="logo-bonito">Math<span>Lingo</span></h1>

          <div className="decoracion-subtitulo"></div>

          <p>Elige tu desafío:</p>    {/* <p> parrafo </p> */}
        </div>

          <div className="botones-dificultad">
            <button className="boton-nivel basico" onClick={() => empezarJuego('facil')}>Nivel Básico</button>

            <button 
              className={`boton-nivel medio 
              ${nivelesDesbloqueados < 2 ? 'bloqueado' : ''} 
              ${botonError === 'intermedio' ? 'animacion-error' : ''}`
              }
              onClick={() => intentarJugar('intermedio', 2)}
              > {nivelesDesbloqueados < 2 ? '🔒 Nivel Medio' : 'Nivel Medio'}
            </button>

            <button className={`boton-nivel dificil
            ${nivelesDesbloqueados < 3 ? 'bloqueado' : ''}
            ${botonError === 'dificil' ? 'animacion-error' : ''}`
            }
            onClick={() => intentarJugar('dificil', 3)}
            > {nivelesDesbloqueados < 3 ? '🔒 Nivel Dificil' : 'Nivel Dificil'}
            </button>

          </div>

        </div>
    );
}