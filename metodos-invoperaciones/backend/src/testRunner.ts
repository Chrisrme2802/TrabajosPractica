import { TransportInput } from './types/transport.js';
import { solveNorthwestCorner } from './services/northwestCorner.js';
import { solveMinimumCost } from './services/minimumCost.js';
import { solveVogel } from './services/vogel.js';

const mockInput: TransportInput = {
  sources: ['Planta A', 'Planta B', 'Planta C'],
  destinations: ['Ciudad X', 'Ciudad Y', 'Ciudad Z'],
  costs: [
    [8, 5, 6],
    [15, 10, 12],
    [3, 9, 10]
  ],
  supply: [120, 80, 80],
  demand: [150, 70, 60],
  method: 'vogel'
};

console.log('====================================');
console.log('====================================\n');

// Probar Vogel
console.log('--- APROXIMACIÓN DE VOGEL ---');
const vogelResult = solveVogel(mockInput);
console.log(`Pasos generados: ${vogelResult.steps.length}`);
vogelResult.steps.forEach(step => {
  console.log(`📍 Paso ${step.stepNumber}: ${step.description}`);
});
console.log('\nMatriz Resultante:');
console.table(vogelResult.allocations);
console.log(`💰 Costo Total Z = $${vogelResult.totalCost}\n`);

// Probar Costo Mínimo
console.log('--- COSTO MÍNIMO ---');
const minCostResult = solveMinimumCost(mockInput);
console.log(`💰 Costo Total Z = $${minCostResult.totalCost}\n`);

// Probar Esquina Noroeste
console.log('--- ESQUINA NOROESTE ---');
const northwestResult = solveNorthwestCorner(mockInput);
console.log(`💰 Costo Total Z = $${northwestResult.totalCost}\n`);