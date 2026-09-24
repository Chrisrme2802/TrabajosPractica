# No hay clases solo modulos con clases publicas dentro

# Modulo saludo
defmodule ModuloSaludo do
    def saludar(nombre) do
    "Hola, #{nombre}"
    end
end

# Modulo calculadora
defmodule Calculadora do
    # Multiclause functions, es como sobrecarga de metodos pero checando (forma, estructura, valores)
    # doc documentacion formal de la funcion
    @doc " Divide dos números. Retorna {:ok, resultado} o {:error, mensaje}. "
    # Type annotations
    @spec dividir(number(), number()) :: {:ok, float()} | {:error, String.t()}
    def dividir(_numerador, 0) do
      #Los returns son idealmente en tuplas, el :error es un ATOM como identificador de return {:status, valor}
      {:error, "No se puede dividir entre cero"}
    end

    def dividir(numerador, denominador) do
      {:ok, numerador/denominador}
    end
end

# Modulo basico recursivo
defmodule ListaRecursiva do
    @doc "Suma todos los numeros de una lista"
    @spec sumar_lista(list(number())) :: number()

    #Caso base
    def sumar_lista([]), do: 0

    #Caso recursivo
    def sumar_lista([head | tail]) do
      head + sumar_lista(tail)
    end
end

mensaje = ModuloSaludo.saludar("Christian")
lista = [10, 20, 30]
IO.puts(mensaje)
IO.puts ListaRecursiva.sumar_lista(lista)
