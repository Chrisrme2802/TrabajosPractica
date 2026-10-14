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
}