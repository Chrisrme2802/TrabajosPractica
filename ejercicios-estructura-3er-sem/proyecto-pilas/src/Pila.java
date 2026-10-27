public class Pila {
    int ePila[];
    int tope;
    int max;

    // constructor para crear la pila con su tamaño solicitado 
    public Pila(int tamaño) {
        ePila = new int [tamaño];
        tope = -1;
        max = ePila.length-1;
    }

    // metodo insertar
    public void insertar(int dato) {
        if(tope == max )
            System.out.println("PILA LLENA, NO SE PUEDE AGREGAR MAS ELEMENTOS.");
        else
        {
            tope++;
            ePila[tope]=dato;
            System.out.println(" Valor agregado correctamente " + dato);
        }
    }

    // metodo eliminar
    public void eliminar() {
        int eliminado = 0;
        if(tope== -1) // significa que si la pila esta vacia
            System.out.println(" la pila esta vacia ");
        else {
            eliminado = ePila[tope];
            ePila[tope]=0;
            tope--;
            System.out.println(" VALOR ELIMINADO "+eliminado);
        }
    }

    // metodo extraer
    public int extraer() {
    if (vacio()) {
        System.out.println("La pila esta vacia, no se puede extraer nada.");
        return -1;
    } else {
        int extraido = ePila[tope];
        ePila[tope] = 0;
        tope--;
        return extraido;
    }
}
        
    // metodo vacio 
    public boolean vacio() {
        if (tope== -1)
            return true;
        else 
            return false;
    }

    // disponibilidad
    public int disponible() {
        int dif = (ePila.length-1)-tope;
        return dif;
    }

    // metodo tamaño
    public int tamaño(){
        return ePila.length;
    }

    // metodo imprimir
    public void imprimir() {
        System.out.println(" Pila copmpleta ");
        for(int x=ePila.length-1;x>=0;x--) {
            System.out.println("["+ePila[x]+"]");
        }
    }

}