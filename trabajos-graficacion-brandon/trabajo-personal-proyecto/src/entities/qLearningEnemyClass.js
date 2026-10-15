class QLearningEnemy extends Enemy {
    constructor(gridX, gridY) {
        super(gridX, gridY);
        this.color = COLORS.QENEMY;
        
        // parametros
        this.alpha = 0.1;   // Learning rate
        this.gamma = 0.9;   // Discount factor
        this.epsilon = 0.15; // 20% exploración, 80% explotación
        
        this.qTable = this.loadQTable() || {};
        this.stepCounter = 0;

        this.hp = 3;
        this.maxHp = 3;
        
        this.actions = [
            { dx: 0, dy: -1 }, // 0: UP
            { dx: 0, dy: 1 },  // 1: DOWN
            { dx: -1, dy: 0 }, // 2: LEFT
            { dx: 1, dy: 0 }   // 3: RIGHT
        ];
    }

    draw() {
        if (this.shouldSkipDraw()) return;

        push();
        noStroke();
        let px = this.gridX * CONFIG.SIZE + CONFIG.SIZE / 2;
        let py = this.gridY * CONFIG.SIZE + CONFIG.SIZE / 2;

        if (this.hitTimer > 0) {
            fill(COLORS.DAMAGE);
        } else {
            fill(this.color);
        }

        rectMode(CENTER);
        rect(px, py, CONFIG.SIZE * 0.75, CONFIG.SIZE * 0.75, 6);

        // ojos
        fill(255);
        rect(px - 5, py - 3, 4, 6);
        rect(px + 5, py - 3, 4, 6);

        // barra de vida
        let barWidth = CONFIG.SIZE * 0.8;
        let barHeight = 4;
        let barY = py - CONFIG.SIZE / 2 - 6;

        fill(COLORS.HPBACKGROUND);
        rect(px, barY, barWidth, barHeight, 2);

        fill(COLORS.HP);
        let currentBarWidth = (this.hp / this.maxHp) * barWidth;
        rectMode(CORNER);
        rect(px - barWidth / 2, barY - barHeight / 2, currentBarWidth, barHeight, 2);

        pop();
    }

    update() {
        this.updateEntity();
        if (frameCount % this.moveInterval === 0) {
            this.stepLearning();
        }
        this.checkPlayerCollision();
    }

    // simplificacion de datos (negativo, neutro, positivo)
    getState() {
        if (!player) return "NO_PLAYER";

        // relacion al jugador
        let dx = Math.sign(player.gridX - this.gridX); // -1, 0, 1
        let dy = Math.sign(player.gridY - this.gridY); // -1, 0, 1

        // detectar bombas
        let nearBomb = this.getNearestBomb() ? "DANGER" : "SAFE";

        return `${dx}_${dy}_${nearBomb}`;
    }

    getNearestBomb() {
        return bombs.find(b => {
            if (b.exploded) return false;
            let inSameRow = b.gridY === this.gridY && Math.abs(b.gridX - this.gridX) <= 3;
            let inSameCol = b.gridX === this.gridX && Math.abs(b.gridY - this.gridY) <= 3;
            return inSameRow || inSameCol;
        }) || null;
    }

    getQValues(state) {
        if (!this.qTable[state]) {
            // inicializar qTable
            this.qTable[state] = [0, 0, 0, 0];
        }
        return this.qTable[state];
    }

    chooseAction(state) {
        // Epsilon-Greedy
        if (random(1) < this.epsilon) {
            return floor(random(this.actions.length)); // Acción aleatoria (Exploración)
        } else {
            let qValues = this.getQValues(state);
            return qValues.indexOf(Math.max(...qValues)); // Mejor acción (Explotación)
        }
    }

    stepLearning() {
        this.stepCounter++;

        let currentState = this.getState();
        let actionIndex = this.chooseAction(currentState);
        let action = this.actions[actionIndex];

        let nextX = this.gridX + action.dx;
        let nextY = this.gridY + action.dy;

        // recompensa y validez
        let reward = -1;
        let isValidMove = true;

        if (nextY < 0 || nextY >= gameMap.rows || nextX < 0 || nextX >= gameMap.cols) {
            isValidMove = false;
            reward = -10;
        } else {
            let cell = gameMap.matrix[nextY][nextX];
            let hasBomb = bombs.some(b => !b.exploded && b.gridX === nextX && b.gridY === nextY);

            if ((cell.mapElement && cell.mapElement.isSolid) || hasBomb) {
                isValidMove = false;
                reward = -10; // castigo
            }
        }

        // recompensa
        if (isValidMove && player) {
            let oldDist = dist(this.gridX, this.gridY, player.gridX, player.gridY);
            let newDist = dist(nextX, nextY, player.gridX, player.gridY);

            if (newDist < oldDist) reward += 10;  // acercar
            if (newDist === 0) reward += 100;     // atrapar
        }

        // interaccion con bombas
        let currentBomb = this.getNearestBomb();
        if (currentBomb) {
            let oldBombDist = dist(this.gridX, this.gridY, currentBomb.gridX, currentBomb.gridY);
            let newBombDist = dist(nextX, nextY, currentBomb.gridX, currentBomb.gridY);

            if (newBombDist > oldBombDist) {
                reward += 15; // Recompensa por alejarse de la bomba
            } else if (newBombDist <= oldBombDist) {
                reward -= 20; // Castigo por acercarse o quedarse en el peligro
            }
        }

        if (isValidMove) {
            this.gridX = nextX;
            this.gridY = nextY;
        }

        // calcular nuevo estado y actualizar
        let nextState = this.getState();
        let currentQ = this.getQValues(currentState)[actionIndex];
        let maxNextQ = Math.max(...this.getQValues(nextState));

        // Ecuación Bellman de Q-Learning
        this.qTable[currentState][actionIndex] = currentQ + this.alpha * (reward + this.gamma * maxNextQ - currentQ);

        if (this.stepCounter % 50 === 0) {
            this.saveQTable();
        }
    }

    takeDamage(amount = 1) {
        this.hp -= amount;
        this.hitTimer = 15;
        console.log(` Vida ${this.hp}/${this.maxHp}`);
        return this.hp <= 0; // true si muere
    }

    saveQTable() {
        try {
            localStorage.setItem("bomberman_qtable", JSON.stringify(this.qTable));
            console.log("QTable guardada");
        } catch (e) {
            console.error("Error al guardar QTable:", e);
        }
    }

    loadQTable() {
        try {
            let saved = localStorage.getItem("bomberman_qtable");
            if (saved) {
                console.log("QTable previa cargada");
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error("Error al cargar QTable:", e);
        }
        return null;
    }

    resetBrain() {
        this.qTable = {};
        localStorage.removeItem("bomberman_qtable");
        console.log("Memoria borrada");
    }

}