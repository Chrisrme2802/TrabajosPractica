function agregarTarea() {

    let input = document.getElementById("tareaInput");

    let texto = input.value;

    if(texto === ""){
        return;
    }

    let nuevaTarea = document.createElement("li");

    nuevaTarea.textContent = texto;

    document.getElementById("listaTareas").appendChild(nuevaTarea);

    input.value = "";
}