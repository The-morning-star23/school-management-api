require('dotenv').config();
const mysql = require('mysql2');

// Create a connection pool using variables from .env
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert pool to use promises so we can use async/await
const promisePool = pool.promise();

// Test the connection
promisePool.getConnection()
    .then((connection) => {
        console.log('✅ Database connected successfully');
        connection.release();
    })
    .catch((err) => {
        console.error('❌ Database connection failed:', err.message);
    });

module.exports = promisePool;