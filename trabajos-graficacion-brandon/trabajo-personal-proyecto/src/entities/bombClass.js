class ExplosionTile {
    constructor(gridX, gridY, duration = 15) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.timer = duration;
    }

    update() {
        this.timer--;
    }

    draw() {
        push();
        fill(COLORS.EXPLOSION);
        noStroke();
        rect(
            this.gridX * CONFIG.SIZE + CONFIG.SIZE * 0.05,
            this.gridY * CONFIG.SIZE + CONFIG.SIZE * 0.05,
            CONFIG.SIZE * 0.9,
            CONFIG.SIZE * 0.9,
            4
        );
        pop();
    }
}

class Bomb {
    constructor(gridX, gridY, range = 1) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.range = range;
        this.timer = 150;
        this.exploded = false;
    }

    draw() {
        // pulso
        let pulse = sin(frameCount * 0.2) * 3;

        fill(COLORS.BOMB);
        stroke("#000000");
        strokeWeight(1);
        
        // temporal
        circle(
            this.gridX * CONFIG.SIZE + CONFIG.SIZE / 2,
            this.gridY * CONFIG.SIZE + CONFIG.SIZE / 2,
            CONFIG.SIZE * 0.7 + pulse
        );
    }

    update() {
        this.timer--;
        if (this.timer <= 0) {
            this.explode();
        }
    }

    explode() {
        this.exploded = true;

        const directions = [
            { dx: 0, dy: 0 },   // CENTER
            { dx: 0, dy: -1 },  // UP
            { dx: 0, dy: 1 },   // DOWN
            { dx: -1, dy: 0 },  // LEFT
            { dx: 1, dy: 0 }    // RIGHT
        ];

        directions.forEach(dir => {
            for (let i = 1; i <= this.range; i++) {
                let targetX = this.gridX + dir.dx * i;
                let targetY = this.gridY + dir.dy * i;

                // limite mapa
                if (targetY >= 0 && targetY < gameMap.rows && targetX >= 0 && targetX < gameMap.cols) {
                    let cell = gameMap.matrix[targetY][targetX];
                    let element = cell.mapElement;

                    // indestructible
                    if (element && element.label === "wall") {
                        break;
                    }

                    explosions.push(new ExplosionTile(targetX, targetY));

                    // destructible
                    if (element && element.label === "box") {
                        gameMap.destroyBoxAndSpawnItem(targetX, targetY);
                        break;
                    }

                    // item
                    if (element instanceof Item) {
                        cell.mapElement = null;
                    }

                    // bomba
                    let otherBomb = bombs.find(b => !b.exploded && b.gridX === targetX && b.gridY === targetY);
                    if (otherBomb) {
                        otherBomb.explode();
                    }

                    // colision jugador con bomba
                    if (player && player.gridX === targetX && player.gridY === targetY) {
                        lives--;
                        player.respawn();
                    }

                    // colision enemigo bomba
                    enemies = enemies.filter(enemy => {
                    if (enemy.gridX === targetX && enemy.gridY === targetY) {
                        if (enemy instanceof QLearningEnemy) {
                            let isDead = enemy.takeDamage(1);
                            return !isDead;
                            } else {
                                return false;
                            }
                    }
                    return true;
                    });
                }
            }
        });
    }
}