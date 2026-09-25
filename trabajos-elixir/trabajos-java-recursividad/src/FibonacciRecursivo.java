import java.util.Scanner;

public class FibonacciRecursivo {
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

        imprimirSecuenciaRecursiva(posicionMaxima);
        System.out.println();
        System.out.println("El numero en la posicion " + posicionMaxima + " es " + fibonacciRecursivo(posicionMaxima));
    }
    
    public static int fibonacciRecursivo(int posicionMaxima) {
        //Caso base (Condicion de salida)
        if (posicionMaxima == 2) {
            return 1;
        } else if (posicionMaxima == 1) {
            return 0;
        }

        //Caso recursivo
        return (fibonacciRecursivo(posicionMaxima-1) + fibonacciRecursivo(posicionMaxima-2));
    }
    
    public static void imprimirSecuenciaRecursiva(int posicionMaxima) {
        //Caso base (Condicion de salida)
        if (posicionMaxima == 0) {
            return;
        }

        //Caso recursivo
        imprimirSecuenciaRecursiva(posicionMaxima-1);

        //Fase de retorno
        if (posicionMaxima > 1) {
            System.out.print(" - ");
        }
        System.out.print(fibonacciRecursivo(posicionMaxima));
    }
}