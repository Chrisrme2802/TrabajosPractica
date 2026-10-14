class Enemy extends Entity{
    constructor(gridX, gridY) {
        super("enemy", gridX, gridY, COLORS.ENEMY, false);
        this.moveInterval = 30; // movimiento cada 30 frames
    }

    draw() {
        if (this.shouldSkipDraw()) return;
        
        fill(this.color);
        noStroke();
        // temporal
        rect(
            this.gridX * CONFIG.SIZE + CONFIG.SIZE * 0.1,
            this.gridY * CONFIG.SIZE + CONFIG.SIZE * 0.1,
            CONFIG.SIZE * 0.8,
            CONFIG.SIZE * 0.8,
            5
        );
    }

    update() {
        this.updateEntity();
        if (frameCount % this.moveInterval === 0) {
            this.moveAutonomously();
        }

        this.checkPlayerCollision();
    }

    moveAutonomously() {
        let directions = [
            { dx: 0, dy: -1 }, // UP
            { dx: 0, dy: 1 },  // DOWN
            { dx: -1, dy: 0 }, // LEFT
            { dx: 1, dy: 0 }   // RIGHT
        ];

        // Mezclar direcciones aleatoriamente
        directions.sort(() => random() - 0.5);

        for (let dir of directions) {
            let targetX = this.gridX + dir.dx;
            let targetY = this.gridY + dir.dy;
            let hasBomb = bombs.some(b => !b.exploded && b.gridX === targetX && b.gridY === targetY);

            if (targetY >= 0 && targetY < gameMap.rows && targetX >= 0 && targetX < gameMap.cols) {
                let element = gameMap.matrix[targetY][targetX].mapElement;
                let isBlocked = (element && element.isSolid) || hasBomb;

                if (!isBlocked) {
                    this.gridX = targetX;
                    this.gridY = targetY;
                    break;
                }
            }
        }
    }

    checkPlayerCollision() {
        if (player && !player.isInvincible && this.gridX === player.gridX && this.gridY === player.gridY) {
            console.log("Contacto con enemigo");
            lives--;
            player.respawn();
        }
    }
}