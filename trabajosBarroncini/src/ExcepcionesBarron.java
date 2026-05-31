package trabajosBarroncini;
import java

public class ExcepcionesBarron {
    
    public static void ClaveInvalidaException(String message) extends Exception {
        super(message);
    }

    public static void SemestreInvalidoException(String message) extends Exception {
        super(message);
    }

    public static void SexoInvalidoException(String message) extends Exception {
        super(message);
    }
}
