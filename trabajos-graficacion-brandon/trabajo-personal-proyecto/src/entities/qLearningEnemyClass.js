class QLearningEnemy extends Enemy {
    constructor(gridX, gridY) {
        super(gridX, gridY);
        this.color = COLORS.QENEMY;
        
        // parametros
        this.alpha = 0.1;   // Learning rate
        this.gamma = 0.9;   // Discount factor
        this.epsilon = 0.2; // 20% exploración, 80% explotación
        
        // { "estado_str": [q_up, q_down, q_left, q_right] }
        this.qTable = {};
        
        this.actions = [
            { dx: 0, dy: -1 }, // 0: UP
            { dx: 0, dy: 1 },  // 1: DOWN
            { dx: -1, dy: 0 }, // 2: LEFT
            { dx: 1, dy: 0 }   // 3: RIGHT
        ];
    }

    // simplificacion de datos (negativo, neutro, positivo)
    getState() {
        if (!player) return "NO_PLAYER";

        // relacion al jugador
        let dx = Math.sign(player.gridX - this.gridX); // -1, 0, 1
        let dy = Math.sign(player.gridY - this.gridY); // -1, 0, 1

        // detectar bombas
        let nearBomb = bombs.some(b => dist(b.gridX, b.gridY, this.gridX, this.gridY) <= 2) ? "DANGER" : "SAFE";

        return `${dx}_${dy}_${nearBomb}`;
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

    update() {
        if (frameCount % this.moveInterval === 0) {
            this.stepLearning();
        }
        this.checkPlayerCollision();
    }

    stepLearning() {
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
    }
}