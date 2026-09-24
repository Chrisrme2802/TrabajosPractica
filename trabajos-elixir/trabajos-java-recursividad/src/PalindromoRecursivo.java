public class PalindromoRecursivo {
    public static void main(String[] args) {
        System.out.println("Detectar palindromo");
        boolean resultado = esPalindromo("aceite");
        System.out.println( resultado? "Es un palindromo" : "No es un palindromo");
    }

    public static boolean esPalindromo(String palabra) {
        return esPalindromoAux(palabra, 0, palabra.length());
    }

    public static boolean esPalindromoAux(String palabra, int inicio, int fin) {
        // Caso base (Condicion de salida)
        if (inicio >= fin) {
            return true;
        } else if (palabra.charAt(inicio) != (palabra.charAt(fin-1))) {
            return false;
        }
        
        // Caso recursivo
        return esPalindromoAux(palabra, inicio+1, fin-1);
    }
}