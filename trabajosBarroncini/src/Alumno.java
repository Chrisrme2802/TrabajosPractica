public class Alumno extends Persona {
    //Atributos
    private String clave;
    private int semestre;
    private int[] calificaciones;

    //Constructor
    public Alumno(String clave, int semestre, int[] calificaciones) throws ExcepcionesBarron {
        super()
    }

    //Metodos
    public String getClave() {
        return clave;
    }

    public void setClave(String clave) throws ExcepcionesBarron {
        if (clave.length() == 5) {
            this.clave = clave;
        } else {
            throw new ClaveInvalidaException("La clave no tiene exactamente 5 valores");
        }
    }

    public int getSemestre() {
        return semestre;
    }

    public void setSemestre(int semestre) throws ExcepcionesBarron {
        if ((semestre >= 1)&&(semestre <= 12)) {
            this.semestre = semestre;
        } else {
            throw new SemestreInvalidoException("El semestre no esta dentro de 1-12");
        }
        
    }

    public int[] getCalificaciones() {
        return calificaciones;
    }

    public void setCalificaciones(int[] calificaciones) throws ExcepcionesBarron {
        for(calificacion : calificaciones) {
            if ((calificacion>100)||(calificacion<0)) {
                throw new CalificacionesInvalidasException("Las calificaciones no cumplen el rango 0-100");
            }
        }
        this.calificaciones = calificaciones;
    }
        
}
