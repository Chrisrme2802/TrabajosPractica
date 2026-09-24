# Palindromo
defmodule PalindromoRecursivo do
  # si regresa booleano acaba con ?
  def es_palindromo?(palabra) when is_binary(palabra) do
    es_palindromo_aux(palabra)
  end

  # Caso base (Condiciones de salida)
  defp es_palindromo_aux(""), do: true
  defp es_palindromo_aux(<<_un_caracter::utf8>>), do: true

  # Caso recursivo
  defp es_palindromo_aux(palabra) do
    primero = String.at(palabra, 0)
    ultimo = String.at(palabra, -1)

    if primero == ultimo do
      subcadena = String.slice(palabra, 1..-2//1)
      es_palindromo_aux(subcadena)
    else
      false
    end
  end
end

mensaje = if PalindromoRecursivo.es_palindromo?("rallar") do
   "Es un palindromo"
else
   "No es un palindromo"
end

IO.puts(mensaje)
