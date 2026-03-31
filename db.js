require('dotenv').config(); // Esto lee el archivo .env
const mysql = require('mysql2');

const pool = mysql.createPool({
    // Busca la variable, si no existe usa 'localhost' (para tu PC)
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin123',
    database: process.env.DB_NAME || 'panaderia',
    port: process.env.DB_PORT || 3306,
    
    // Solo activa SSL si la variable DB_SSL es 'true' (como en Aiven)
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null,
    
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();