-- Tablas del proyecto, primero principales luego las de foreign keys
CREATE TABLE IF NOT EXISTS usuarios (
    google_ID VARCHAR(255) PRIMARY KEY,
    nombre VARCHAR(100),
    foto_url TEXT,
    monedas INTEGER DEFAULT 0,
    experiencia INTEGER DEFAULT 0,
    nivel_desbloqueado INTEGER DEFAULT 1,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    racha_actual INTEGER DEFAULT 0,
    ultima_conexion DATE DEFAULT CURRENT_DATE
);