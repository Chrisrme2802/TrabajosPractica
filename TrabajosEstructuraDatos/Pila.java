package TrabajosEstructuraDatos;
public class Pila<T> {
    private Nodo<T> = tope;

    public Pila() {
        this.tope = null;
    }

    public void insertar(T dato) {
        Nodo<T> nuevoNodo = new Nodo<>(dato);
        nuevoNodo.siguiente = tope;
        tope = nuevoNodo;
    }

    public T eliminar() {
        if (tope == null) {
            return null;
        }
        while (tope.siguiente != null) {
            T datoEliminado = tope.dato;
            tope = datoEliminado.siguiente;
        }
        return datoEliminado;
    }
}