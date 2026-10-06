export const THEME = {
  // Estados de balance / tipo de matriz
  badge: {
    balanced: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    unbalanced: 'bg-amber-100 text-amber-800 border border-amber-300',
    hungarianSquare: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    hungarianRect: 'bg-amber-100 text-amber-800 border border-amber-300'
  },

  // Estilos del Método Húngaro (deshabilitados y cubrimientos)
  hungarian: {
    // Fila o columna cubierta por una sola línea
    coveredBg: 'bg-red-200/80',
    coveredBorder: 'border-red-400',
    coveredLine: 'bg-red-600',

    // Intersección de dos líneas (Fila + Columna)
    intersectionBg: 'bg-purple-200',
    intersectionBorder: 'border-purple-500',
    intersectionLine: 'border-2 border-purple-600',

    // Deshabilitados en tabla editable (Oferta/Demanda en Húngaro)
    disabledHeader: 'bg-red-100 text-red-700 font-bold',
    disabledInput: 'bg-red-100/80 border-red-300 text-red-600 font-bold cursor-not-allowed',
    disabledCellBg: 'bg-red-50'
  },

  // Botones de acción y controles
  buttons: {
    addRow: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    addCol: 'bg-blue-600 hover:bg-blue-700 text-white',
    remove: 'text-red-500 hover:text-red-700 hover:bg-red-100 font-bold',
    solve: 'bg-emerald-600 hover:bg-emerald-700 text-white'
  },

  // Celdas de asignación y selección
  cells: {
    selected: 'bg-emerald-200 border-2 border-emerald-600 ring-2 ring-emerald-400',
    allocated: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    finalAssignment: 'bg-emerald-200 border-2 border-emerald-600 font-extrabold'
  },

  // Filas y columnas descartadas (oferta/demanda agotada en 0)
  discarded: {
    cellBg: 'bg-red-100/60 border-red-200 text-red-300',
    headerBg: 'bg-red-100/50 text-red-700',
    rowBg: 'bg-red-50/80 text-slate-400',
    badge: 'text-red-600 bg-red-100/80 line-through font-bold'
  }
};