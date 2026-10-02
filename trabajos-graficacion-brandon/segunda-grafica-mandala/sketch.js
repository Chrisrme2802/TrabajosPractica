let colorInterior;

function setup() {
    createCanvas(800, 800);
    rectMode(CENTER);
    colorInterior = color(255, 255, 0); // Amarillo puro
    noStroke();
}

function draw() {
    background(100,0,100);
    translate(width / 2, height / 2);
    
    let colorExterior = color(255, 95, 105); // Amarillo más claro
    
    for (let i = 500; i > 0; i -= 5) {
        // Normalizamos 'i' entre 0.0 y 1.0 para el lerpColor
        let amt = map(i, 0, 500, 0, 1);
        
        // Calculamos el color intermedio
        let c = lerpColor(colorInterior, colorExterior, amt);
        
        // Asignamos la transparencia (0 a 255, p. ej. 50 para un efecto suave)
        
        fill(c);
        rotate(frameCount * 0.001); // Rotación acumulativa
        square(0, 0, i);
    }

    
}

function mousePressed(){
    colorInterior = color(random(255),random(255),random(255));
}