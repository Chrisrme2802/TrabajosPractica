public class Tablero {
    //Atributos
    public Celula [][] tablero;
    public int nColumnas;
    public int nFilas;

    //Constructor
    public Tablero(int columnas, int filas) {
        this.nFilas = filas;
        this.nColumnas = columnas;
        this.tablero = new Celula[columnas][filas];
        for (int i = 0; i < nColumnas; i++) {
            for (int j = 0; j < nFilas; j++) {
                tablero[i][j] = new Celula(i, j, EstadoCelda.MUERTO);
            }
        }
    }

    //Metodos
    public void imprimirTablero() {
        for (int i = 0; i < nFilas; i++) {
            for (int j = 0; j < nColumnas; j++) {
                System.out.print(tablero[i][j].getSimbolo() + " ");
            }
            System.out.println();
        }
    }

    public void agregarCelula(int columnaCelula, int filaCelula) {
        this.tablero[columnaCelula][filaCelula].setEstadoActual(EstadoCelda.VIVO);     
    }

    public int contarVecinos(int columna, int fila) {
        int contadorVecinos = 0;
        for (int i = columna - 1; i <= columna + 1; i++) {
            for (int j = fila - 1; j <= fila + 1; j++) {
                if ((i >= 0)&&(i < nColumnas)&&(j >= 0)&&(j < nFilas)) {
                    if (!(i == columna && j == fila)) {
                        if (tablero[i][j].getEstadoActual() == EstadoCelda.VIVO) {
                            contadorVecinos++;
                        }
                    }
                }
            }
        }
        return contadorVecinos;
    }

    public void actualizarTablero() {
        for (int i = 0; i < nColumnas; i++) {
            for (int j = 0; j < nFilas; j++) {
                Celula celulaActual = tablero[i][j];
                celulaActual.actualizarEstado();
            }
        }
    }

    //Getters
    public int getNFilas() {
        return this.nFilas;
    }

    public int getNColumnas() {
        return this.nColumnas;
    }

    public Celula [][] getCelulas() {
        return this.tablero;
    }

}