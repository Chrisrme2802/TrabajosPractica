import express from 'express';
import cors from 'cors';
import { solveTransportProblem } from './controllers/transportController.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/solve', solveTransportProblem);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});