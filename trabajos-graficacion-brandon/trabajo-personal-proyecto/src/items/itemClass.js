class Item extends MapElement {
    constructor(typeConfig, gridX, gridY) {
        super(typeConfig.id, gridX, gridY, typeConfig.color, false);
        
        this.type = typeConfig;
    }

    draw(x, y, size) {
        push();
        let centerX = x + size / 2;
        let centerY = y + size / 2;

        let pulse = sin(frameCount * 0.1) * 2;
        fill(this.color);
        noStroke();
        ellipse(centerX, centerY, size * 0.6 + pulse);

        noFill();
        stroke(255, 200);
        strokeWeight(1.5);
        ellipse(centerX, centerY, size * 0.65 + pulse);
        pop();
    }

    applyEffect(player) {
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
        }
    }
}