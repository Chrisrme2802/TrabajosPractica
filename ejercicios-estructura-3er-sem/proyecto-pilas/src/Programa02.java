import java.util.Scanner;

public class Programa02 {
    static Scanner sc = new Scanner(System.in);
    public static void main(String[] args) {
        System.out.println("Programa proyecto de pilas");
        System.out.println("--------------------------");
        System.out.println();

        System.out.println("Llenar primera pila de 10 elementos con numeros enteros");
        Pila primeraPila = new Pila(10);
        for (int i=0; i<10; i++) {
            System.out.print("Elemento numero " + (i+1) + ":");
            int numero = sc.nextInt();
            primeraPila.insertar(numero);
        }

        System.out.println("Primera pila: ");
        primeraPila.imprimir();

        // pila secundaria para mover valores
        Pila segundaPila = new Pila(10);

        int maximo = Integer.MIN_VALUE;
        int minimo = Integer.MAX_VALUE;
        int posMax = -1;
        int posMin = -1;

        for (int i=0; i<10; i++) {
            int valorIterado = primeraPila.extraer();

            if (valorIterado > maximo) {
                maximo = valorIterado;
                posMax = i + 1;
            }
            
            if (valorIterado < minimo) {
                minimo = valorIterado;
                posMin = i + 1;
            }
            segundaPila.insertar(valorIterado);
        }

        System.out.println("Resultados: ");
        System.out.println("El numero maximo en la pila es " + maximo + " en la posicion " + posMax);
        System.out.println("El numero minimo en la pila es " + minimo + " en la posicion " + posMin);
    }
}