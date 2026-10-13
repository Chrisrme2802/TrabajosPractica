class Player {
    constructor(gridX, gridY) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.color = COLORS.PLAYER;
        this.direction = "DOWN";

        this.bombRange = 1;
        this.maxBombs = 1;
        this.moveDelay = 15;
        
        this.lastMoveFrame = 0;
    }

    draw() {
        fill(this.color);
        noStroke();
        // temporal
        let posX = this.gridX * size + size / 2;
        let posY = this.gridY * size + size / 2;
        
        ellipse(posX, posY, size * 0.8);
        
        // visor para direccion
        fill(COLORS.VISOR);
        let offset = size * 0.2;
        if (this.direction === "UP") ellipse(posX, posY - offset, 6);
        if (this.direction === "DOWN") ellipse(posX, posY + offset, 6);
        if (this.direction === "LEFT") ellipse(posX - offset, posY, 6);
        if (this.direction === "RIGHT") ellipse(posX + offset, posY, 6);
    }

    respawn() {
        this.gridX = gameMap.playerSpawn.c;
        this.gridY = gameMap.playerSpawn.r;
        this.direction = "DOWN";
    }

    canMove() {
        return frameCount - this.lastMoveFrame >= this.moveDelay;
    }

    move(dx, dy) {
        if (!this.canMove()) return;
        if (dx === 1) this.direction = "RIGHT";
        if (dx === -1) this.direction = "LEFT";
        if (dy === 1) this.direction = "DOWN";
        if (dy === -1) this.direction = "UP";

        let targetX = this.gridX + dx;
        let targetY = this.gridY + dy;

        if (targetY >= 0 && targetY < rows && targetX >= 0 && targetX < cols) {
            let targetCell = gameMap.matrix[targetY][targetX];
            let element = targetCell.mapElement;

            // solidos
            if (element && element.isSolid) {
                return; 
            }

            this.gridX = targetX;
            this.gridY = targetY;
            this.lastMoveFrame = frameCount;

            if (element && !element.isSolid && element.label !== "none") {
                this.collectItem(element, targetX, targetY);
            }
        }
    }

    collectItem(element, x, y) {
        if (element instanceof Item) {
            element.applyEffect(this);
        }
        gameMap.matrix[y][x].mapElement = null; 
    }
}   