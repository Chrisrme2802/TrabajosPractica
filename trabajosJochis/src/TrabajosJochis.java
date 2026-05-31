import java.util.Scanner;
public class TrabajosJochis {
    public static Scanner sc = new Scanner(System.in);
    public static void main(String[] args) {
        System.out.println("Trabajinho arreglos");
        System.out.println("Dame el tamaño del vector");
        int tamaño = sc.nextInt();
        int[] arreglo = crearVector(tamaño);
        imprimirVector(arreglo);
        int[] arregloUltimoDigito = crearVectorUltimoDigito(arreglo);
        int suma = sumarVector(arregloUltimoDigito);
        imprimirVector(arregloUltimoDigito);
        System.out.println("La suma total del vector ultimo digito es " + suma);
        imprimirArregloInvertido(arreglo);

    }

    //Metodo crear vector
    public static int[] crearVector(int tamaño) {
        int[] arreglo = new int[tamaño];
        for (int i=0; i<arreglo.length; i++) {
            arreglo[i] = (int)((Math.random()*81) + 20);
        }
        return arreglo;
    }

    //Metodo imprimir vector
    public static void imprimirVector(int [] arreglo) {
        for (int i=0; i<arreglo.length; i++) {
            System.out.println("Posicion " + (i+1) + ":" + arreglo[i]);
        }
    }

    //Metodo sumar vector
    public static int sumarVector(int[] arreglo) {
        int suma=0;
        for (int i=0; i<arreglo.length; i++) {
            suma += arreglo[i]; 
        }
        return suma;
    }

    //Metodo crear vector ultimo digito
    public static int[] crearVectorUltimoDigito(int[] arreglo) {
        int numeroDigitos=0;
        System.out.println("Dime el ultimo digito");
        int ultimoDigito=0;
        do {
            ultimoDigito = sc.nextInt();
            if ((ultimoDigito > 10)||(ultimoDigito < 0)) {
                System.out.println("El digito no es valido");
            }
        } while ((ultimoDigito > 9)||(ultimoDigito < 0));
        for (int i=0; i<arreglo.length; i++) {
            int valorIterado = arreglo[i]%10;
            if (valorIterado == ultimoDigito) {
                numeroDigitos++;
            }
        }

        int[] nuevoArreglo = new int[numeroDigitos];
        int j=0;
        for (int i=0; i<arreglo.length; i++) {
            int valorIterado = arreglo[i]%10;
            if (valorIterado == ultimoDigito) {
                    nuevoArreglo[j] = arreglo[i];
                    j++;
                }
        }

        return nuevoArreglo;
    }

    //Metodo arreglo invertido
    public static void imprimirArregloInvertido(int[] arreglo) {
        for (int i=arreglo.length-1; i>=0; i--) {
            System.out.println(arreglo[i] + "\t");
        }
    }

}