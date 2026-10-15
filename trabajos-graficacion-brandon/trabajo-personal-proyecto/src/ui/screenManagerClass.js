class ScreenManager {
    static drawGameOver() {
        fill(COLORS.OVERLAY_BG);
        rect(0, 0, width, height);

        fill(COLORS.TEXT_DANGER);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("GAME OVER", width / 2, height / 2 - 20);

        fill(COLORS.TEXT_MAIN);
        textSize(16);
        text("Presiona 'R' para reiniciar", width / 2, height / 2 + 20);
    }

    static drawWin() {
        fill(COLORS.OVERLAY_BG);
        rect(0, 0, width, height);

        fill(COLORS.TEXT_SUCCESS);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("¡VICTORIA!", width / 2, height / 2 - 20);

        fill(COLORS.TEXT_MAIN);
        textSize(16);
        text("Presiona 'R' para reiniciar", width / 2, height / 2 + 20);
    }

    static drawStartScreen() {
        push();
        background(COLORS.BG);
        textAlign(CENTER, CENTER);
        fill(COLORS.TEXT_MAIN);
        
        textSize(36);
        text("BOMBERMAN JS", width / 2, height / 3);
        
        textSize(18);
        text("Presiona ENTER para Empezar", width / 2, height / 2);
        text("Controles: Flechas / WASD | Barra Espaciadora: Bomba", width / 2, height / 1.8);
        pop();
    }

    static drawPauseScreen() {
        push();
        fill(0, 0, 0, 150);
        rect(0, 0, width, height);
        
        textAlign(CENTER, CENTER);
        fill(COLORS.TEXT_MAIN);
        textSize(32);
        text("JUEGO EN PAUSA", width / 2, height / 2);
        textSize(16);
        text("Presiona 'P' para Continuar", width / 2, height / 2 + 40);
        pop();
    }

    static itemOverlay = {
        title: "",
        description: "",
        color: "COLORS.VOID",
        timer: 0,
        maxTimer: 80
    };

    static triggerItemAlert(title, description, color = "#FFFFFF") {
        this.itemOverlay.title = title;
        this.itemOverlay.description = description;
        this.itemOverlay.color = color;
        this.itemOverlay.timer = this.itemOverlay.maxTimer;
    }

    static drawItemOverlay() {
        if (this.itemOverlay.timer <= 0) return;

        this.itemOverlay.timer--;

        let alpha = 200;
        if (this.itemOverlay.timer < 20) {
            alpha = map(this.itemOverlay.timer, 0, 20, 0, 200);
        }

        push();
        fill(0, 0, 0, alpha * 0.75);
        rectMode(CORNER);
        rect(0, 0, width, height);

        rectMode(CENTER);
        fill(20, 24, 33, alpha);
        stroke(this.itemOverlay.color);
        strokeWeight(2);
        rect(width / 2, height / 2, width * 0.7, 120, 12);

        noStroke();
        textAlign(CENTER, CENTER);
        textSize(18);
        textStyle(BOLD);
        fill(this.itemOverlay.color);
        text(this.itemOverlay.title, width / 2, height / 2 - 25);

        textSize(13);
        textStyle(NORMAL);
        fill(255, alpha * 0.9);
        text(this.itemOverlay.description, width / 2, height / 2 + 15);

        pop();
    }
}