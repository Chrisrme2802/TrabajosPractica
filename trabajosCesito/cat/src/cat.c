#include <stdio.h>
#include <stdlib.h>

int main() {
    FILE *archivo;

    //Lo abrimos con read
    archivo = fopen("resources/prueba.txt", "r");

    if (archivo == NULL) {
        printf("Error: Ocurrio un error al abrir el archivo");
        return 1;
    }

    char linea[100];

    while (fgets(linea, sizeof(linea), archivo) != NULL) {
        printf("%s", linea);
    }

    fclose(archivo);

    return 0;
}