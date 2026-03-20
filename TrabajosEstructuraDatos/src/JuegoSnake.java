import java.util.LinkedList;    //Importa las listas
import java.util.Queue;     //Importa la fila/cola //No lo estoy usando
public class JuegoSnake {
    public static void main(String[] args) {
    LinkedList<String> serpiente = new LinkedList<>();   //Creas una cola instanciada como lista
    serpiente.add("10,10");
    serpiente.add("10,11");
    serpiente.add("10,12");
    System.out.println(serpiente);

    serpiente.addFirst("10,9");
    serpiente.removeLast();
    System.out.println(serpiente);

    }
}
