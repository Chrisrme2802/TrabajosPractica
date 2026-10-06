import { Request, Response } from 'express';
import { TransportInput } from '../types/transport.js';
import { solveNorthwestCorner } from '../services/northwestCorner.js';
import { solveMinimumCost } from '../services/minimumCost.js';
import { solveVogel } from '../services/vogel.js';
import { solveHungarian } from '../services/hungarian.js';

export const solveTransportProblem = (req: Request, res: Response) => {
  const input: TransportInput = req.body;

  if (!input || !input.costs) {
    return res.status(400).json({ error: 'Faltan datos obligatorios en la matriz.' });
  }

  try {
    let result;
    switch (input.method) {
      case 'northwest':
        result = solveNorthwestCorner(input);
        break;
      case 'minimum-cost':
        result = solveMinimumCost(input);
        break;
      case 'vogel':
        result = solveVogel(input);
        break;
      case 'hungarian':
        result = solveHungarian(input);
        break;
      default:
        return res.status(400).json({ error: 'Método no válido.' });
    }

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno al procesar el algoritmo.' });
  }
};