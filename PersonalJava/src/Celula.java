public class Celula {
    //Atributos
    private int fila;
    private int columna;
    private EstadoCelda estadoActual;
    private EstadoCelda estadoSiguiente;

    //Constructor
    public Celula(int fila, int columna, EstadoCelda estadoInicial) {
        this.fila = fila;
        this.columna = columna;
        this.estadoActual = estadoInicial;
    }

    //Metodos
    public void actualizarEstado(){
        this.estadoActual = this.estadoSiguiente;
    } 

    public void setEstadoActual(EstadoCelda nuevoEstado) {
        this.estadoActual = nuevoEstado;
    }

    public void setEstadoSiguiente(EstadoCelda estadoSiguiente) {
        this.estadoSiguiente = estadoSiguiente;
    }

    //Getter
    public char getSimbolo() {
        return this.estadoActual.getSimbolo();
    }

    public EstadoCelda getEstadoActual() {
        return this.estadoActual;
    }
}