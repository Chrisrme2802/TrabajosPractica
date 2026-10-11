import { GraphRenderer } from './components/graph-renderer.js';

document.addEventListener('DOMContentLoaded', () => {
  const renderer = new GraphRenderer('graph-canvas');

  // Inicializar prueba
  console.log('Visualizador inicializado. Haz doble clic en el lienzo para crear nodos.');
});