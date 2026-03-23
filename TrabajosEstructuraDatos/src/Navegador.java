import java.util.Stack; //Importo las pilas
public class Navegador {

    //Atributos de la clase (mejor aqui arriba)
    private Stack<String> pilaPrincipal = new Stack<>();  //Instancio la pila principal
    private Stack<String> pilaSecundaria = new Stack<>();  //Instancio la pila secundaria
    
    public static void main(String[] args) {
        
        Navegador navegadorPersonal = new Navegador();  //Instancio el navegador (constructor general)

        navegadorPersonal.visitar("google.com");
        navegadorPersonal.visitar("github.com");
        navegadorPersonal.visitar("stackoverflow.com");
        navegadorPersonal.mostrarEstado();

        System.out.println("Click en desahcer");
        navegadorPersonal.deshacer();
        navegadorPersonal.mostrarEstado();

        System.out.println("Click en deshacer");
        navegadorPersonal.deshacer();
        navegadorPersonal.mostrarEstado();

        System.out.println("Click en rehacer");
        navegadorPersonal.rehacer();
        navegadorPersonal.mostrarEstado();

        System.out.println("\n--- 🆕 Visitando una nueva página ---");
        navegadorPersonal.visitar("youtube.com");
        navegadorPersonal.mostrarEstado();

    }

    //Metodos generales
    public void visitar(String url) {
        pilaPrincipal.push(url);
        pilaSecundaria.clear();
        System.out.println("Visitaste " + url);
    }

    //Metodos con pilas simular ctrl z / ctrl shift z
    public void deshacer() {
        if (!pilaPrincipal.isEmpty()) {
            pilaSecundaria.push(pilaPrincipal.pop());
            System.out.println("Deshecho");
        } else {
            System.out.println("No puedes hacer deshacer");
        }
    }

    public void rehacer() {
        if (!pilaSecundaria.isEmpty()) {
            pilaPrincipal.push(pilaSecundaria.pop());
            System.out.println("Rehecho");
        } else {
            System.out.println("No puedes hacer rehacer");
        }
    }

    //Metodos para imprimir
        public void mostrarEstado() {
        System.out.println("Historial actual: " + pilaPrincipal);
        System.out.println("Historial hacia adelante: " + pilaSecundaria);
        if (!pilaPrincipal.isEmpty()) {
            System.out.println("Pagina actual: " + pilaPrincipal.peek());
        }
    }

}