# coments
# no declaras el dato
print('Hola mundo')
if 5 > 3:
    print('5 es mayor que 3')

lista = [1, 2, 3]
lista.append(4)
print(lista)

diccionario = {
    "nombre": "Gael",
    "comida": "Taco",
    "Estatura": 1.72
}
print(diccionario["nombre"]) # O tmb .get("nombre")
diccionario["nombre"] = "Christian"
print(diccionario["nombre"])
diccionario["bebida"] = "Jamaica" #Agregas
print(diccionario)
#Eliminas con pop() popitem() o del al principio

minina = {
        "nombre": "minina",
        "edad": 4
    }

gatos = {
    "minino": {
        "nombre": "minino",
        "edad": 5
    },
    "minina": minina
}
print(gatos)
perros = dict(nombre = "Camilo", edad = 6)
#print(dir(perros)) Te dara todo lo que puedes hacer con diccionarios en este caso

#&& es and y || es or
print("Cuando devuelve true") if 5 < 2 else print("Cuando devuelve false") 

#Ingresar datos
dato = input("Ingrese un dato: ")
print(dato)

try: 
    num = int(input("Ingresa un numero: "))
    resultado = 10 / num
except ValueError: #No puede convertir un dato de otra cosa a int 
    print("Debes ingresar un numero valido")
except ZeroDivisionError:   #No puede dividir entre 0
    print("No puedes dividir entre 0")
except Exception as e:  #Igual que en exception de java cacha todo
    print("Ocurrio un error inesperado: ", e)
else: 
    print("El resultado es: ", resultado)
finally:
    print("FIN DEL PROGRAMA")