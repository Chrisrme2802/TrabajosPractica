import java.util.Scanner;

public class TorreHanoi {

    static Scanner sc = new Scanner(System.in);

    public static void moverDiscos(int numeroDiscos, String origen, String auxiliar, String destino) {
        // Caso base (Condicion de salida)
        if (numeroDiscos == 1) {
            System.out.println("Mover el disco 1 desde " + origen + " hasta " + destino);
            return;
        }

        moverDiscos(numeroDiscos-1, origen, destino, auxiliar);
        System.out.println("Mover el disco " + numeroDiscos + " desde " + origen + " hasta " + destino);

        // Caso recursivo
        moverDiscos(numeroDiscos - 1, auxiliar, origen, destino);

    }

    public static void main(String[] args) {
        System.out.println("Torre de Hanoi");
        System.out.println("Numero de discos");
        int numeroDiscos = sc.nextInt();
        System.out.println("Movimientos para resolver la torre: ");
        moverDiscos(numeroDiscos, "Origen", "Auxiliar", "Destino");
        long totalMovimientos = (long) (Math.pow(2, numeroDiscos) - 1);
        System.out.println("El total de movimientos para resolverla es: " + totalMovimientos);
    }
}
