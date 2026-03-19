const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

// Middleware para que el servidor entienda JSON (lo que enviará la calculadora)
app.use(express.json());
app.use(cors({
    origin: '*', // Permite peticiones desde cualquier lugar
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Esta es una ruta "raíz" por si olvidas poner /api/status
app.get('/', (req, res) => {
    console.log("¡Alguien entró a la raíz!");
    res.send("Servidor funcionando, pero intenta ir a /api/status");
});

app.get('/api/status', (req, res) => {
    console.log("Petición de estatus recibida");
    res.json({ mensaje: "¡Conexión exitosa! 🚀" });
});

app.listen(port, "0.0.0.0", () => { // 🚩 El "0.0.0.0" ayuda en la nube
    console.log(`Servidor activo en puerto ${port}`);
});