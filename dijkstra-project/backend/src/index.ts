import express from 'express';
import cors from 'cors';
import { DijkstraController } from './controllers/dijkstra-controller.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoint de la API
app.post('/api/dijkstra', DijkstraController.calculate);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});