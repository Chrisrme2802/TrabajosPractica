##HTML
<!DOCTYPE html> Declaras que estas usando HTML
<html>      Es el contenedor de toda la pagina
</html>
<head>      Cosas que no se ven directamente en la pagina (Titulo de la pagina, contectar con css)
</head>     (metadatos como tags de busqueda, caracteres, ajustar a dispositivos, titulos de preview al compartir)
<title>Lista de tareas</title>      Titulo pestaña del navegador
<link rel="stylesheet" href="style.css"> (Conectar con CSS, rel: relacion con documento stylesheet: css href: archivo a cargar)
<body>      Todo lo visible de la pagina
</body>
<h1>Lista de Tareas<h1>     Encabezado grande (h1 h2 h3 h4 h5 h6)
<input type="text" id="tareaInput" placeholder="Escribe una tarea">     (Type: tipo de input text: texto id: indentificador placeholder: ayuda para el lector)
<button onclick="agregarTarea()">Agregar</button>       (onclick: ejectuta js)
<ul id="listaTareas"></ul>      (lista desordenada)(sin nada)
<ol>
   <li>primer paso</li>         (lista ordenada)(numéros)
   <li>segundo paso</li>
</ol>
<li>estudiar</li>       (elemento de una lista)
<script src="script.js"></script>       (carga el js src: (source) archivo js) busca ese archivo y ejecutalo, funciona con fotos tmb "foto.png"
<div class="tarjeta">
   <h2>Titulo</h2>          (div sirve para agrupar cosas)(asi aplicas estilo a todo en general y no individualmente)
   <p>Texto</p>
</div>

##CSS
selector {
   propiedad: valor;
}
body {      (Cuerpo general del HTML)
}
font-family: Arial;     (Define la fuente)
background-color: #f4f4f4;      (Color del fondo)
text-align: center;     (Alinea el texto (left center right))
justify-content: center;        (usado para alinear elementos, no texto, flex por ejemplo se ordena)
padding: 10px;      (Espacio interno del elemento)  contenido y borde
font-size: 16px;        (tamaño del texto)
margin: 10px;       (espacio externo del elemento)      borde y otros elementos
list-style: none;    
disc     •              (algunos estilos de lista)
circle   ○
square   ■
decimal  1.2.3
none     (sin marcador)   
color: red;         (cambia el color del texto)
display: block;         (define como se comporta un elemento)   (abarca toda la linea)
flex        (listas dentro de una lista acomodas elementos en una misma linea con [] [] [])
inline      (todo en la misma linea)
grid   grid-template-columns: 1fr 1fr;      (acomoda en lineas y columnas)

##JavaScript
function agregarTarea(){        (Defines funcion o metodo)
}
let input       (declaras variable)
document        (todo el html como si llamaras a una clase)
document.getElementById("tareaInput")       (buscas un elemento por su id)
input.value     (obtienes el valor de una variable)
= asignacion de valor       == comparacion chill (valor general)        === comparacion estricta (valor y tipo)
"" String vacio 
document.createElement("li")        (crea elemento html nuevo) (lista en este caso)
nuevaTarea.textContent = texto      (asignas texto a un elemento)
appendChild(nuevaTarea)         (agregas elemento dentro de otro)(para que siempre este la opcion de agregar otra tarea, rellamar a nuevaTarea)
document.querySelector(".tarjeta")          (modificar todo un bloque de html)