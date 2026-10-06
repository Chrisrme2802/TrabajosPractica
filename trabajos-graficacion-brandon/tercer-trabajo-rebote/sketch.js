let logo
let size = 100
let x = 0
let y = 0
let vel = 10
let r,g,b
let esq = 0
let velY
let velX

function preload() {
    logo = loadImage("./assets/images.jpg")
}

function setup() {
    createCanvas(windowWidth, windowHeight)
    
    //Inicio aleatorio de posicion
    x = random(0, width - size)
    y = random(0, height - size)

    //Inicio aleatorio de direccion
    velX = random([-vel, vel])
    velY = random([-vel, vel])

    //Cambiar color inicial
    cambiarColor()
}

function draw() {
    background(255,255,255)

    //Cambiar color de la imagen
    tint(r, g, b)

    //Dibujar logo
    image(logo, x, y, size, size)

    //Mover logo
    x =  x + velX
    y = y + velY

    let tocoX = false
    let tocoY = false

    //Deteccion de bordes
    //Bordes de X
    if (x + size >= width) {
        x = width - size
        tocoX = true
        console.log("toco x: "+tocoX)
    } else if (x <= 0) {
        x = 0
        tocoX = true
        console.log("toco x: " + tocoX)
    }
    //Bordes de Y
    if (y + size >= height) {
        y = height - size
        tocoY = true
        console.log(tocoY)
    } else if (y <= 0) {
        y = 0
        tocoY = true
        console.log(tocoX)
    }

    //Rebotar
    if (tocoX) {
        velX = velX * -1
    }
    if (tocoY) {
        velY = velY * -1
    }
    if (tocoX || tocoY) {
        cambiarColor()
    }

    //Contar colision de esquinas
    if (tocoX && tocoY) {
        esq = esq + 1
    }

    noTint()
    fill(0)
    textSize(24)
    text("ESquinas: " + esq, 20, 40)
}

function cambiarColor() {
    r = random(0, 255)
    g = random(0, 255)
    b = random(0, 255)
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}