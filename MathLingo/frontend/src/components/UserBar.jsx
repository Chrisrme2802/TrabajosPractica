{/* Pantalla de juego HTML*/}
export function UserBar({ stats }) {
    //Saco las variables que ocupo de stats
    const { 
        monedas = 0, 
        experiencia = 0,
        rango = 'Novato' 
    } = stats || {};
    
    {/* nav es como un div, navigation, caja especializada para que se ubique el usuario*/}
    return (
        <aside className="user-bar">
          <div className="stat-monedas animar-cambio">🪙 {monedas}</div>
          <div className="stat-rango animar-cambio">{rango}</div>
          <div className="stat-exp animar-cambio">⭐ {experiencia} XP</div>
        </aside>
    );
}