let riverMatrix = []
let riverRows = 5
let riverCols = 15
let riverSize = 30

function setup() {
    createCanvas(550, 500)
    initializeRiver()
}

function draw() {
    background(255,255,255)
    drawRiver()

    if (frameCount % 30 === 0) {
        updateElements()
    }
}

function initializeRiver() {
    for (let i = 0; i < riverRows; i++) {
        let cellRow = []
        riverMatrix.push(cellRow)
        for (let j = 0; i < riverCols; j++) {
            const voidElement = new MapElement("none", i, j, "#ffffff")
            const cell = new Cell()
            cell.voidElement = voidElement
            cellRow.push(cell)
        }
    }
}

function drawRiver() {
    array.forEach(cellRow => {
        cellRow.forEach(cell => {
            let element = cell.MapElement
            if(!element) { element = cell.voidElement }
            rect(element.posX*riverSize, element.posY*riverSize, riverSize, riverSize)
        });
    });
}

function spawnElements() {
    let spawnRow = floor(random(0, maxRows1))
    let righDirection = random() > 0.5
    if (righDirection) {
        let 
    }
    let elementType = random(["fish", "time", "powerUp"])

}

function updateElements() {

}