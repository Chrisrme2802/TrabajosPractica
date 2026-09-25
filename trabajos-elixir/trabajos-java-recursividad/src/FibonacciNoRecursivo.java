import java.util.Scanner;

public class FibonacciNoRecursivo {
    static Scanner sc = new Scanner(System.in);
    public static void main(String[] args) {
        System.out.println("Fibonacci Recursivo");
        System.out.println("Hasta que numero de la secuencia quieres?");
        int posicionMaxima;
        do {
            posicionMaxima = sc.nextInt();
            if (posicionMaxima <= 0) {
                System.out.println("El numero debe ser positivo");
            }
        } while (posicionMaxima <= 0);

        int [] secuencia = metodoFibonacci(posicionMaxima);
        imprimirVectorInt(secuencia);
        System.out.println();
        System.out.println("El numero en la posicion " + posicionMaxima + " es " + secuencia[posicionMaxima - 1]);
        }

    public static int [] metodoFibonacci(int posicionMaxima) {
        int [] secuencia = new int[posicionMaxima];
        int primero = 0, segundo = 1;
        for (int i=0; i<posicionMaxima; i++) {
            secuencia[i] = primero;
            int siguiente = primero + segundo;
            primero = segundo;
            segundo = siguiente;
        }
        return secuencia;
    }

    public static void imprimirVectorInt(int [] vector) {
        for (int i=0; i<vector.length; i++) {
            if (i > 0) {
                System.out.print(" - ");
            }
            System.out.print(vector[i]);
        }
    }
}