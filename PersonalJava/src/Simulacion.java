public class Simulacion {
    //Atributos
    private Tablero tablero;

    //Constructor
    public Simulacion(Tablero tablero) {
        this.tablero = tablero;
    }

    //Metodos
    public void ejecutarSimulacion() {
        int columnas = tablero.getNColumnas();
        int filas = tablero.getNFilas();
        for (int i = 0; i < columnas; i++) {
            for (int j = 0; j < filas; j++) {
                Celula celulaActual = tablero.getCelulas()[i][j];
                int nVecinos = tablero.contarVecinos(i, j);
                if (celulaActual.getEstadoActual() == EstadoCelda.VIVO) {
<<<<<<< HEAD
                        if ((nVecinos == 2)||(nVecinos == 3)) {
=======
                        if ((nVecinos < 2)||(nVecinos >= 3)) {
                        celulaActual.setEstadoSiguiente(EstadoCelda.MUERTO);
                    } else {
>>>>>>> 9c7121414b1c7a88600394be0a673b8cec696fb7
                        celulaActual.setEstadoSiguiente(EstadoCelda.VIVO);
                    } else {
                        celulaActual.setEstadoSiguiente(EstadoCelda.MUERTO);
                    }
                } else {
                    if (nVecinos == 3) {
                        celulaActual.setEstadoSiguiente(EstadoCelda.VIVO);
                    } else {
                        celulaActual.setEstadoSiguiente(EstadoCelda.MUERTO);
                    }
                }
            }
        }
    }
}