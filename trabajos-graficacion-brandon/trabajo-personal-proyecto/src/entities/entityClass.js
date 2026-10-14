class Entity extends MapElement {
    constructor(label, gridX, gridY, color, isSolid = false) {
        super(label, gridX, gridY, color, isSolid);

        this.gridX = gridX;
        this.gridY = gridY;

        this.hp = 1;
        this.maxHp = 1;
        this.isInvincible = false;
        this.invincibleTimer = 0;
        this.hitTimer = 0;
    }

    setInvincible(durationFrames = 120) {
        this.isInvincible = true;
        this.invincibleTimer = durationFrames;
    }

    takeDamage(amount = 1) {
        if (this.isInvincible) return false;

        this.hp -= amount;
        this.hitTimer = 15;

        this.setInvincible(30); 

        return this.hp <= 0;
    }

    updateEntity() {
        if (this.isInvincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.isInvincible = false;
            }
        }

        if (this.hitTimer > 0) {
            this.hitTimer--;
        }
    }

    shouldSkipDraw() {
        return this.isInvincible && frameCount % 6 < 3;
    }
}