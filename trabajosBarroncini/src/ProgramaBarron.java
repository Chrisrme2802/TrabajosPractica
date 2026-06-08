//Imports de lectura de archivos
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
//Imports extras
import java.util.ArrayList;
import java.util.List;

public class ProgramaBarron {
    public static void main(String[] args) {
        //Declaracion de cositas
        List<Alumnos> alumnos = new ArrayList<>();
        List<String> lineasInvalidas = new ArrayList<>();

        //Objetos para leer archivos
        try (BufferedReader br = new BufferedReader(new FileReader("FuenteDatosBarron.txt"))) {
          String linea;
          int numeroLinea = 0;

          while(linea = br.readLine()!=null) {
            numeroLinea++;
            linea = linea.trim();

            if(linea.isEmpty()) continue();

            
        }
        }
        

    }

}