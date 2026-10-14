const CONFIG = {
    ROWS: 16,
    COLS: 16,
    SIZE: 30,
    INITIAL_LIVES: 3,
    INITIAL_TIMER: 120,
    ENEMY_COUNT: 4,
    HUD_HEIGHT: 40
};

let gameMap;
let player;
let bombs = [];
let explosions = [];
let enemies = [];

let gameState = "START";
let lives = CONFIG.INITIAL_LIVES
let timer = CONFIG.INITIAL_TIMER
let lastTimerCheck = 0;

function setup() {
    createCanvas(CONFIG.COLS * CONFIG.SIZE, CONFIG.ROWS * CONFIG.SIZE + 40);

    gameMap = new MapManager(CONFIG.ROWS, CONFIG.COLS, CONFIG.SIZE);
    gameMap.initializeMap();
    gameMap.initializeObstacles();

    player = new Player(gameMap.playerSpawn.c, gameMap.playerSpawn.r);

    enemies = gameMap.spawnEnemies(CONFIG.ENEMY_COUNT, player.gridX, player.gridY);
    lastTimerCheck = millis();
}

function draw() {
    background(COLORS.BG);
    if (gameState === "START") {
        ScreenManager.drawStartScreen();
    } else if (gameState === "PLAYING") {
        player.update();
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
    } else if (gameState === "PAUSED") {
        ScreenManager.drawPauseScreen();
    }
}

function checkGameRules() {
    // checar vidas
    if (lives <= 0 || timer <= 0) {
        gameState = "GAME_OVER";
        saveAllQEnemies();
    }

    // checar victoria
    if (enemies.length === 0 && player) {
        let currentCell = gameMap.matrix[player.gridY][player.gridX];
        if (currentCell.mapElement && currentCell.mapElement.label === "exit") {
            gameState = "WIN";
            saveAllQEnemies();
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
    lives = CONFIG.INITIAL_LIVES;
    timer = CONFIG.INITIAL_TIMER;
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

    // inicio
    if (gameState === "START") {
        if (keyCode === ENTER || keyCode === 13 || key === "Enter") {
            resetGame();
        }
        return;
    }

    // pausa
    if ((key === 'p' || key === 'P') && (gameState === "PLAYING" || gameState === "PAUSED")) {
        gameState = (gameState === "PLAYING") ? "PAUSED" : "PLAYING";
        return;
    }

    // reset
    if (gameState === "GAME_OVER" || gameState === "WIN") {
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

function saveAllQEnemies() {
    enemies.forEach(enemy => {
        if (enemy instanceof QLearningEnemy) {
            enemy.saveQTable();
        }
    });
    console.log("Todas las QTable guardadas")
}