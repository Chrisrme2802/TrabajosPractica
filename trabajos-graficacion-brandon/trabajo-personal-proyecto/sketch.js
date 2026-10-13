let matrix = []
let rows = 16
let cols = 16
let size = 30

function setup() {
    createCanvas(550, 500)
    initializeMap()
    initializeObstacles()
}

function draw() {
    background(255,255,255)
    drawMap()

}

function initializeMap() {
    for (let i = 0; i < rows; i++) {
        let cellRow = []
        matrix.push(cellRow)
        for (let j = 0; j < cols; j++) {
            const voidElement = new MapElement("none", i, j, "#ffffff")
            const cell = new Cell()
            cell.voidElement = voidElement
            cellRow.push(cell)
        }
    }
}

function drawMap() {
    matrix.forEach(cellRow => {
        cellRow.forEach(cell => {
            let element = cell.mapElement
            if(!element) { element = cell.voidElement }
            rect(element.posX*size, element.posY*size, size, size)
        });
    });
}

function initializeObstacles() {
    
}