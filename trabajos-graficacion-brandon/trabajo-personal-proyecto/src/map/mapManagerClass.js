class MapManager {
    constructor(rows, cols, size) {
        this.rows = rows;
        this.cols = cols;
        this.size = size;
        this.matrix = [];
        this.playerSpawn = { r: 1, c: 1 };
        this.exitPosition = null;
    }

    draw() {
        this.matrix.forEach(cellRow => {
            cellRow.forEach(cell => {
                let element = cell.mapElement ? cell.mapElement : cell.voidElement;
                
                fill(element.color);
                stroke(COLORS.GRID_STROKE);
                rect(element.posX * this.size, element.posY * this.size, this.size, this.size);
            });
        });
    }

    initializeMap() {
        this.matrix = [];
        for (let i = 0; i < this.rows; i++) {
            let cellRow = [];
            for (let j = 0; j < this.cols; j++) {
                const voidElement = new MapElement("none", j, i, COLORS.VOID);
                const cell = new Cell(voidElement, null);
                cellRow.push(cell);
            }
            this.matrix.push(cellRow);
        }
    }

    chooseRandomEdgeSpawn() {
        let possibleSpawns = [];
        for (let r = 1; r < this.rows - 1; r++) {
            for (let c = 1; c < this.cols - 1; c++) {
                // bordes internos jugables
                if (r === 1 || r === this.rows - 2 || c === 1 || c === this.cols - 2) {
                    // excluir casillas de pilares internos
                    if (!(r % 2 === 0 && c % 2 === 0)) {
                        possibleSpawns.push({ r: r, c: c });
                    }
                }
            }
        }
        this.playerSpawn = random(possibleSpawns);
    }

    initializeObstacles() {
        let boxCells = [];
        this.chooseRandomEdgeSpawn();

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                
                // indestructibles
                if (r === 0 || r === this.rows - 1 || c === 0 || c === this.cols - 1 || (r % 2 === 0 && c % 2 === 0)) {
                    this.matrix[r][c].mapElement = new MapElement("wall", c, r, COLORS.WALL, true);
                } 
                // zona de spawn
                else if (dist(c, r, this.playerSpawn.c, this.playerSpawn.r) <= 1.5) {
                    this.matrix[r][c].mapElement = null;
                } 
                // destructibles
                else if (random(1) < 0.6) {
                    this.matrix[r][c].mapElement = new MapElement("box", c, r, COLORS.BOX, true);
                    boxCells.push({ r, c });
                }
            }
        }
        if (boxCells.length > 0) {
            this.exitPosition = random(boxCells);
        }
    }

    spawnEnemies(count, playerX, playerY) {
        let enemies = [];
        let spawned = 0;
        let attempts = 0;

        // casillas vacias y lejanas al jugador
        while (spawned < count && attempts < 100) {
            attempts++;
            let r = floor(random(1, this.rows - 1));
            let c = floor(random(1, this.cols - 1));
            let cell = this.matrix[r][c];
            
            let isEmpty = cell.mapElement === null || cell.mapElement.label === "none";
            let isFarFromPlayer = dist(c, r, playerX, playerY) > 4;

            if (isEmpty && isFarFromPlayer) {
                if (spawned === 0) {
                    enemies.push(new QLearningEnemy(c, r));
                } else {
                    enemies.push(new Enemy(c, r));
                }
                spawned++;
            }
        }
        return enemies;
    }

    destroyBoxAndSpawnItem(x, y, dropChance = 0.3) {
        let cell = this.matrix[y][x];

        if (this.exitPosition && this.exitPosition.c === x && this.exitPosition.r === y) {
            cell.mapElement = new MapElement("exit", x, y, COLORS.EXIT, false);
            console.log("Puerta de salida");
            return;
        }

        // probabilidad
        if (random(1) < dropChance) {
            const availableItems = [
                ITEM_TYPES.BOMB_UP,
                ITEM_TYPES.RANGE_UP,
                ITEM_TYPES.SPEED_UP,
                ITEM_TYPES.TIME_ADD,
                ITEM_TYPES.TIME_SUB
            ];
            let selectedType = random(availableItems);
            cell.mapElement = new Item(selectedType, x, y);
        } else {
            cell.mapElement = null;
        }
    }
}