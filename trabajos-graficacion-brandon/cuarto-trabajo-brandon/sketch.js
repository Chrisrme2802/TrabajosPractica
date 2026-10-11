
const matrix = [] //matrix de celdas
let maxRows = 10;
let maxCols = 10;
let mapSize = 50;
let pacman = null;

function setup(){
    createCanvas(550,550);
    initializeMap();
    spawnPacman();
    console.log(matrix);

}

function draw(){
    background(255,255,255);
    drawMap()

}


function initializeMap(){
    for(let i = 0; i < maxRows; i++){
        const cellRows = [];
        matrix.push(cellRows);
        for(let j = 0; j < maxCols; j++){
            const voidElement = new MapElement("none",i,j,"#ffffff");
            const cell = new Cell();
            cell.voidElement = voidElement;
            cellRows.push(cell);


        }
    }
}

function drawMap(){

    matrix.forEach((cellRow) => {
        cellRow.forEach((cell) => {
            let element = cell.mapElement
            if(!element){element = cell.voidElement}
            fill(element.color);
            rect(element.posX*mapSize,element.posY*mapSize, mapSize, mapSize);
        })
    })
}

function spawnPacman(){
    let posX = floor(random(0,maxRows - 1));
    let posY = floor(random(0,maxCols - 1));
    pacman = new MapElement("pacman",posX,posY,"#ffff00");
    matrix[posX][posY].mapElement = pacman;
}

function keyPressed(){
    let newPosX = pacman.posX;
    let newPosY = pacman.posY;
    if(key === "w"){
        newPosY--;
    }else if(key === "s"){
        newPosY++;
    }else if(key === "a"){
        newPosX--;
    }else if( key === "d"){
        newPosX++;
    }

    if(newPosX >= maxCols){
       newPosX = 0; 
    }
    if(newPosX < 0){
        newPosX = maxCols -1;
    }
    if(newPosY >= maxRows){
       newPosY = 0; 
    }
    if(newPosY < 0){
        newPosY = maxRows -1;
    }

    let cell = matrix[newPosX][newPosY];
    if(cell.mapElement){
        newPosX = pacman.posX;
        newPosY = pacman.posY;
    }else{

        matrix[pacman.posX][pacman.posY].mapElement = null;
        

        pacman.posX = newPosX;
        pacman.posY = newPosY;
        matrix[pacman.posX][pacman.posY].mapElement = pacman;

    }





}