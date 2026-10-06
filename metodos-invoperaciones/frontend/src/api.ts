import { TransportInput, TransportResult } from './types/transport.js';

export async function solveProblem(data: TransportInput): Promise<TransportResult> {
  const response = await fetch('http://localhost:3000/api/solve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al resolver el problema de transporte');
  }

  return response.json();
}