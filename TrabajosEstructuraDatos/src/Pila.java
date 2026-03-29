public class Pila<T> {
    private Nodo<T> tope;

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
            T nodoEliminado = tope.dato;
            tope = tope.siguiente;
            return nodoEliminado;
    }
}