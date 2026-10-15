class Item extends MapElement {
    constructor(typeConfig, gridX, gridY) {
        super(typeConfig.id, gridX, gridY, typeConfig.color, false);
        
        this.type = typeConfig;
    }

    draw() {
        push();
        let centerX = this.gridX * CONFIG.SIZE + CONFIG.SIZE / 2;
        let centerY = this.gridY * CONFIG.SIZE + CONFIG.SIZE / 2;

        let pulse = sin(frameCount * 0.1) * 2;
        
        if (this.type.id === ITEM_TYPES.GHOST.id || this.type.color === "RAINBOW") {
            fill(getRainbowColor(5));
        } else {
            fill(this.type.color);
        }

        noStroke();
        ellipse(centerX, centerY, CONFIG.SIZE * 0.6 + pulse);

        noFill();
        stroke(255, 200);
        strokeWeight(1.5);
        ellipse(centerX, centerY, CONFIG.SIZE * 0.65 + pulse);
        pop();
    }

    applyEffect(player) {
        ScreenManager.triggerItemAlert(
            `¡${this.type.name}!`,
            `Efecto obtenido: ${this.type.name}`,
            this.type.color === "RAINBOW" ? "#A855F7" : this.type.color
        );
        
        switch (this.type.id) {
            case ITEM_TYPES.BOMB_UP.id:
                player.maxBombs++;
                console.log(`Bombas maximas: ${player.maxBombs}`);
                break;

            case ITEM_TYPES.RANGE_UP.id:
                player.bombRange++;
                console.log(`Rango de explosion: ${player.bombRange}`);
                break;

            case ITEM_TYPES.SPEED_UP.id:
                player.moveDelay = max(4, player.moveDelay - 2);
                console.log(`Cooldown de movimiento: ${player.moveDelay} frames`);
                break;

            case ITEM_TYPES.TIME_ADD.id:
                timer += 10;
                console.log("¡Tiempo extra +10s!");
                break;

            case ITEM_TYPES.TIME_SUB.id:
                timer = max(0, timer - 5);
                console.log("¡Trampa! -5s");
                break;
            case ITEM_TYPES.GHOST.id:
                player.activateGhostMode(300);
                break;
        }
    }
}

function getRainbowColor(speed = 5) {
        colorMode(HSB, 360, 100, 100);
        let hueValue = (frameCount * speed) % 360;
        let c = color(hueValue, 80, 100);
        colorMode(RGB, 255);
        return c;
}