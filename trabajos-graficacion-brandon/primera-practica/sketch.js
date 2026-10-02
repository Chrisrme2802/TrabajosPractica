function setup() {
  createCanvas(600, 400);
  rectMode(CENTER);
  angleMode(DEGREES); // Define los ángulos en grados
}

function draw() {
  background(220); // Limpia la pantalla en cada fotograma
  // --- CUADRADO (Traslación) ---
  push();
    translate(100, 200);
    fill(230, 80, 80);
    noStroke();
    rect(0, 0, 70, 70);
  pop();

  // --- TRIÁNGULO (Rotación sobre su propio eje) ---
  push();
    translate(300, 200);     // 1. Mueve el origen al centro donde quieres el triángulo
    rotate(frameCount * 20);   // 2. Rota el lienzo en ese punto
    fill(80, 180, 80);
    stroke(0);
    triangle(-35, 35, 0, -35, 35, 35); // 3. Dibuja el triángulo centrado en (0,0)
  pop();
}