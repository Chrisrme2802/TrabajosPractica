package TrabajosEstructuraDatos;
public class Cola {
    private Nodo<T> inicio;
    private Nodo<T> finalCola;

    public Cola() {
        this.inicio = null;
        this.finalCola = null;
    }

    public void Insertar(T dato) {
        Nodo<T> nuevoNodo = new Nodo<>(dato);
        if (inicio == null) {
            inicio = nuevoNodo;
            finalCola = nuevoNodo;
        } else {
            finalCola.siguiente = nuevoNodo;
            finalCola = nuevoNodo;
        }
    }

    public T eliminar() {
        if (inicio == null) {
            return null;
        }
        datoEliminado = inicio.dato;
        inicio = inicio.siguiente;

        return datoEliminado;
    }

    public boolean buscar(T dato) {
        Nodo<T> actual = inicio;
        while (actual != null) {
            if (actual.dato.equals(dato)) {
                return true;
            } else {
                actual = actual.siguiente;
            }
        }
        return false;
    }
}