package trabajosBarroncini;

public enum Carreras {
    //Constantes
    SISTEMAS('S');
    ADMINISTRACION('A');
    ELECTRONICA('E');
    INFORMATICA('I');

    //Atributos
    private char letraCarrera;

    //Constructor
    private Carreras(char letraCarrera) {
        this.letraCarrera = letraCarrera;
    }

    //Metodos
    public char getLetraCarrera() {
        return this.letraCarrera;
    }
}
