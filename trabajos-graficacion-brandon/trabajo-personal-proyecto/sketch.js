let rows = 16;
let cols = 16;
let size = 30;
let gameMap;

let player;
let bombs = [];
let explosions = [];
let enemies = [];

let gameState = "PLAYING";
let lives = 3;
let timer = 120;
let lastTimerCheck = 0;

function setup() {
    createCanvas(cols * size, rows * size + 40);

    gameMap = new MapManager(rows, cols, size);
    gameMap.initializeMap();
    gameMap.initializeObstacles();

    player = new Player(gameMap.playerSpawn.c, gameMap.playerSpawn.r);

    enemies = gameMap.spawnEnemies(2, player.gridX, player.gridY);
    lastTimerCheck = millis();
}

function draw() {
    background(COLORS.BG);
    
    if (gameState === "PLAYING") {
        updateTimer();
        checkGameRules();

        if (player) {
            if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // A
                player.move(-1, 0);
            } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // D
                player.move(1, 0);
            } else if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // W
                player.move(0, -1);
            } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // S
                player.move(0, 1);
            }
        }
        
        // mover el mapa abajo para los 40 de arriba
        push();
        translate(0, 40);
        gameMap.draw();
        
        if (player) {
            player.draw();
        }

        bombs.forEach(bomb => {
            bomb.update();
            bomb.draw();
        });
        // solo bombas no explotadas
        bombs = bombs.filter(bomb => !bomb.exploded);

        for (let i = explosions.length - 1; i >= 0; i--) {
            explosions[i].update();
            explosions[i].draw();
            if (explosions[i].timer <= 0) {
                explosions.splice(i, 1);
            }
        }

        enemies.forEach(enemy => {
            enemy.update();
            enemy.draw();
        });
        pop();

        drawHUD();
    } else if (gameState === "GAME_OVER") {
        ScreenManager.drawGameOver();
    } else if (gameState === "WIN") {
        ScreenManager.drawWin();
    }
}

function checkGameRules() {
    // checar vidas
    if (lives <= 0 || timer <= 0) {
        gameState = "GAME_OVER";
    }

    // checar victoria
    if (enemies.length === 0 && player) {
        let currentCell = gameMap.matrix[player.gridY][player.gridX];
        if (currentCell.mapElement && currentCell.mapElement.label === "exit") {
            gameState = "WIN";
        }
    }
}

function updateTimer() {
    if (millis() - lastTimerCheck >= 1000) {
        timer--;
        lastTimerCheck = millis();

        if (timer <= 0) {
            timer = 0;
            gameState = "GAME_OVER";
        }
    }
}

function drawHUD() {
    fill(COLORS.HUD_BG);
    noStroke();
    rect(0, 0, width, 40);

    textSize(16);
    textAlign(LEFT, CENTER);
    
    fill(COLORS.TEXT_DANGER);
    text(`Vidas: ${lives}`, 15, 20);

    // fases de color
    textAlign(RIGHT, CENTER);
    if (timer <= 15) {
        fill(COLORS.TEXT_DANGER);
    } else if (timer <= 30) {
        fill(COLORS.TEXT_WARNING);
    } else {
        fill(COLORS.TEXT_MAIN);
    }
    text(`Tiempo: ${timer}s`, width - 15, 20);
}

function resetGame() {
    lives = 3;
    timer = 60;
    gameState = "PLAYING";
    bombs = [];
    explosions = [];

    gameMap.initializeMap();
    gameMap.initializeObstacles();
    
    player = new Player(gameMap.playerSpawn.c, gameMap.playerSpawn.r);
    enemies = gameMap.spawnEnemies(2, player.gridX, player.gridY);
    
    lastTimerCheck = millis();
}

function keyPressed() {
    if (!player) return;

    // reset
    if (gameState !== "PLAYING") {
        if (key === 'r' || key === 'R') {
            resetGame();
        }
        return;
    }

    // bomba
    else if (keyCode === 32 || key === ' ') {
        let activeBombs = bombs.filter(b => !b.exploded).length;
        let alreadyHasBomb = bombs.some(b => b.gridX === player.gridX && b.gridY === player.gridY);
        
        if (activeBombs < player.maxBombs && !alreadyHasBomb) {
            bombs.push(new Bomb(player.gridX, player.gridY, player.bombRange));
        }
    }
}