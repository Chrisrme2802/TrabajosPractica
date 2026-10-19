import java.util.Scanner;

public class Programa01 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int tamaño, opcion=0;

        System.out.println(" TAMAÑO DE LA PILA ?");
        tamaño=sc.nextInt();

        Pila accion = new Pila(tamaño);
        do {
            System.out.println(" 1.- Insertar 2.- Retirar 3.- Vacio 4.- Tamaño de la pila 5.-Imprimir ");

            opcion= sc.nextInt();

            switch(opcion) {
                // insertar en la pila
                case 1:
                    System.out.println(" Valor a insertar ? ");
                    accion.insertar(sc.nextInt());
                    break;
                case 2: // retira elemento de la pila
                    accion.eliminar();
                    break;
                case 3: // revisar si esta vacia o cuantos tiene disponibles
                    accion.vacio();
                    if (accion.vacio() == true)
                        System.out.println("Pila vacia.");
                    else
                        System.out.println("Espacios disponibles: "+ accion.disponible());
                    break;
                case 4: // saber el tamaño de pila
                    System.out.println(" El tamaño de la pila es " + accion.tamaño());
                case 5: // imprimir pila
                    accion.imprimir();
            }
        } while(opcion != 6);
        
        sc.close();
    }
}