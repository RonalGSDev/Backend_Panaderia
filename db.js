require('dotenv').config(); // Esto lee el archivo .env
const mysql = require('mysql2');

const pool = mysql.createPool({
    // Busca la variable, si no existe usa 'localhost' (para tu PC)
    host: process.env.DB_HOST,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    
    // Solo activa SSL si la variable DB_SSL es 'true' (como en Aiven)
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null,
    
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();