#include <stdio.h>  //Para usar print
#include <stdlib.h> //Para usar malloc y free

int main() {
    int totalProductos = 3;


    //*variable guarda un puntero, malloc pedimos espacio en HEAP a Kernel, un int son 4 bytes, estamos pidiendo 12 bytes al HEAP
    int *precios = (int *) malloc(totalProductos * sizeof(int));

    if (precios == NULL) {
        printf("Error: El sistema operativo se quedo sin RAM.\n");
        return 1;
    }

    precios[0] = 15;
    precios[1] = 20;
    precios[2] = 30;

    printf("Checar la memoria RAM.\n");
    //%p imprime direccion hexadecimal de memoria RAM , &variable nos dice su direccion de memoria
    printf("Variable 'totalProductos' en Stack: Valor = %d, Direccion = %p\n\n", totalProductos, &totalProductos);

    for (int i=0; i<totalProductos; i++) {
        printf("Producto [%d]: Valor = $%d, Direccion = %p\n", i, precios[i], &precios[i]);
    }

    free(precios);
    return 0;
}