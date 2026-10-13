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
}