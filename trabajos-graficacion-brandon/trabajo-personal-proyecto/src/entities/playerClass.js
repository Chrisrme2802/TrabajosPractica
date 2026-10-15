class Player extends Entity {
    constructor(gridX, gridY) {
        super("player", gridX, gridY, COLORS.PLAYER, false);

        this.direction = "DOWN";
        this.bombRange = 1;
        this.maxBombs = 1;
        this.moveDelay = 15;

        this.isGhostMode = false;
        this.ghostModeTimer = 0;
        
        this.lastMoveFrame = 0;
    }

    draw() {
        if (this.shouldSkipDraw()) return;

        push()
        fill(this.color);
        noStroke();

        // temporal
        let posX = this.gridX * CONFIG.SIZE + CONFIG.SIZE / 2;
        let posY = this.gridY * CONFIG.SIZE + CONFIG.SIZE / 2;

        if (this.isGhostMode) {
            let auraSize = CONFIG.SIZE * 1.3 + sin(frameCount * 0.2) * 5;
            let rainbow = getRainbowColor(8);
            
            rainbow.setAlpha(150); 
            fill(rainbow);
            ellipse(posX, posY, auraSize);
        }

        let pulse = sin(frameCount * 0.1) * 2;

        fill(this.hitTimer > 0 ? COLORS.DAMAGE : this.color);
        noStroke();
        
        ellipse(posX, posY, (CONFIG.SIZE * 0.8) + pulse);
    
        let eyeHeight = (frameCount % 120 < 10) ? 1 : 6;

        // ojo para direccion
        fill(COLORS.VISOR);
        let offset = CONFIG.SIZE * 0.2;
        if (this.direction === "UP") ellipse(posX, posY - offset, eyeHeight);
        if (this.direction === "DOWN") ellipse(posX, posY + offset, eyeHeight);
        if (this.direction === "LEFT") ellipse(posX - offset, posY, eyeHeight);
        if (this.direction === "RIGHT") ellipse(posX + offset, posY, eyeHeight);
        pop()
    }

    update() {
        this.updateEntity();
        
        if (this.isGhostMode) {
            this.ghostModeTimer--;
            if (this.ghostModeTimer <= 0) {
                this.isGhostMode = false;
                this.moveDelay = 15;
            }
        }
    }

    respawn() {
        this.gridX = gameMap.playerSpawn.c;
        this.gridY = gameMap.playerSpawn.r;
        this.direction = "DOWN";

        this.setInvincible(120);
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

        if (targetY >= 0 && targetY < gameMap.rows && targetX >= 0 && targetX < gameMap.cols) {
            let targetCell = gameMap.matrix[targetY][targetX];
            let element = targetCell.mapElement;

            // solidos
            if (element && element.label === "wall") {
                return; 
            }

            if (element && element.label === "box") {
                if (this.isGhostMode) {
                    gameMap.destroyBoxAndSpawnItem(targetX, targetY);
                    element = gameMap.matrix[targetY][targetX].mapElement;
                } else {
                    return;
                }
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

    activateGhostMode() {
        this.isGhostMode = true;
        this.ghostModeTimer = 240;
        this.moveDelay = 7;
    }
}   