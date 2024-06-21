const mysql = require('mysql2');
require('dotenv').config();

const { generateTarget } = require('./gameModes');

let pool;

async function initializeDatabase() {
    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        }).promise();

        // Teste die Verbindung
        await pool.query('SELECT 1');
        console.log('Successfully connected to the MySQL database');
    } catch (error) {
        console.error('Error connecting to the MySQL database:', error);
        process.exit(1); // Beendet das Programm bei einem Verbindungsfehler
    }
}

async function getLatestCount() {
    try {
        const [rows] = await pool.query('SELECT number FROM CurrentCount ORDER BY id DESC LIMIT 1');
        return rows.length > 0 ? rows[0].number : 0;
    } catch (error) {
        console.error('Error fetching latest count:', error);
        return 0; // Rückgabe eines Standardwerts im Fehlerfall
    }
}

async function getLatestSender() {
    try {
        const [rows] = await pool.query('SELECT senderId FROM CurrentCount ORDER BY id DESC LIMIT 1');
        return rows.length > 0 ? rows[0].senderId : null;
    } catch (error) {
        console.error('Error fetching latest sender:', error);
        return null; // Rückgabe eines Standardwerts im Fehlerfall
    }
}

async function updateCount(newCount, senderId) {
    try {
        await pool.query('INSERT INTO CurrentCount (number, senderId) VALUES (?, ?)', [newCount, senderId]);
    } catch (error) {
        console.error('Error updating count:', error);
    }
}

async function getMode() {
    try {
        const [rows] = await pool.query('SELECT mode FROM CurrentCount LIMIT 1');
        return rows.length > 0 ? rows[0].mode : 'all';
    } catch (error) {
        console.error('Error fetching mode:', error);
        return 'all'; // Rückgabe eines Standardmodus im Fehlerfall
    }
}

async function resetCount(mode) {
    try {
        // Aktualisiere den Modus in der Datenbank
        await pool.query('UPDATE CurrentCount SET mode = ?', [mode]);
        // Generiere das Ziel basierend auf dem Modus
        const target = generateTarget(mode);
        // Setze den Zählstand auf 0 und füge das neue Ziel ein
        await pool.query('TRUNCATE TABLE CurrentCount');
        await pool.query('INSERT INTO CurrentCount (number, senderId, target, mode) VALUES (0, NULL, ?, ?)', [target, mode]);
    } catch (error) {
        console.error('Error resetting count:', error);
    }
}

async function getTarget() {
    try {
        const [rows] = await pool.query('SELECT target FROM CurrentCount ORDER BY id ASC LIMIT 1');
        return rows.length > 0 ? rows[0].target : null;
    } catch (error) {
        console.error('Error fetching target:', error);
        return null; // Rückgabe eines Standardwerts im Fehlerfall
    }
}

async function isValidBinary(binaryString) {
    // Überprüfen, ob latestCount eine gültige Binärzahl ist
    return /^[01]+$/.test(binaryString);
}

module.exports = {
    initializeDatabase,
    getLatestCount,
    getLatestSender,
    updateCount,
    getMode,
    resetCount,
    getTarget,
    isValidBinary
};
