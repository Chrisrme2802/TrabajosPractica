import java.util.Scanner;
public class AplicacionCelula {
  static Scanner sc = new Scanner(System.in);
  public static void main(String[] args) {
    System.out.println("Aplicacion juego celulas");
    System.out.println("------------------------");
    System.out.println();

    //Pedir datos para tablero
    System.out.println("TABLERO");
    System.out.println("------------------------------------");
    System.out.println("Dime las dimensiones de tu tablero: ");
    System.out.print("Columnas: ");
    int columnas = sc.nextInt();
    sc.nextLine();
    System.out.print("Filas: ");
    int filas = sc.nextInt();
    sc.nextLine();

    //Crear tablero
    Tablero tablero = new Tablero(columnas, filas);

    //Asignar celulas vivas
    System.out.println("CELULAS");
    System.out.println("-------");
    System.out.println("Dime el numero de celulas vivas: ");
    int nCelulas = sc.nextInt();
    sc.nextLine();
    for (int i = 0; i < nCelulas; i++) {
        int columnaCelula;
        int filaCelula;
        System.out.println("Coordenadas de la celula: ");
        System.out.print("Columna: ");
        do {
            columnaCelula = sc.nextInt();
            sc.nextLine();
            if ((columnaCelula < 0)||(columnaCelula >= columnas)) {
                System.out.println("Numero de columna invalido");
            }
        } while ((columnaCelula < 0)||(columnaCelula >= columnas));

        System.out.print("Fila: ");
        do {
            filaCelula = sc.nextInt();
            sc.nextLine();
            if ((filaCelula < 0)||(filaCelula >= filas)) {
                System.out.println("Numero de fila invalido");
            }
        } while ((filaCelula < 0)||(filaCelula >= filas));

        //Asignar celula al tablero
        tablero.agregarCelula(columnaCelula, filaCelula);
    }

    //Crear simulacion
    Simulacion simulacion = new Simulacion(tablero);

    //Hacer la simulacion
    System.out.println("Comenzara la simulacion: ");
    System.out.println("-------------------------");
    char decisionC;
    do {
        System.out.println("Tablero antes de simulacion");
        System.out.println("---------------------------");
        tablero.imprimirTablero();
        simulacion.ejecutarSimulacion();
        tablero.actualizarTablero();
        System.out.println("Tablero despues de simulacion");
        System.out.println("-----------------------------");
        tablero.imprimirTablero();
        System.out.println("Quieres repetir la simulacion? (Si/No)");
        String decisionF = sc.nextLine();
        if (decisionF.toUpperCase().charAt(0) == 'S') {
            decisionC = 'S';
        } else {
            decisionC = 'N';
        }
    } while(decisionC == 'S');
<<<<<<< HEAD
  }  
}
=======
    System.out.println("Juego terminado");
    }  
}
>>>>>>> 9c7121414b1c7a88600394be0a673b8cec696fb7
