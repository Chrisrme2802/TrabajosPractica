public enum EstadoCelda {
    //Constantes
    VIVO('*'),
    MUERTO('.');

    //Atributos
    private final char simbolo;

    //Constructor
    private EstadoCelda(char simbolo) {
        this.simbolo = simbolo;
    }

    //Getter
    public char getSimbolo() {
        return this.simbolo;
    }
}