const mysql = require('mysql2/promise');
require('dotenv').config();

const { generateTarget } = require('./gameModes');

let pool;

async function initializeDatabase() {
    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // Teste die Verbindung
        await pool.query('SELECT 1');
        console.log('Successfully connected to the MySQL database');
    } catch (error) {
        console.error('Error connecting to the MySQL database:', error);
        process.exit(1); // Beendet das Programm bei einem Verbindungsfehler
    }
}

async function getLatestCount() {
    const [rows] = await pool.query('SELECT number FROM CurrentCount ORDER BY id DESC LIMIT 1');
    return rows.length > 0 ? rows[0].number : 0;
}

async function getLatestSender() {
    const [rows] = await pool.query('SELECT senderId FROM CurrentCount ORDER BY id DESC LIMIT 1');
    return rows.length > 0 ? rows[0].senderId : null;
}


async function updateCount(newCount, senderId) {
    await pool.query('INSERT INTO CurrentCount (number, senderId) VALUES (?, ?)', [newCount, senderId]);
}

async function getMode() {
    const [rows] = await pool.query('SELECT mode FROM CurrentCount LIMIT 1');
    if (rows.length > 0) {
        return rows[0].mode;
    } else {
        return 'all'; // Standardmodus, falls keine Daten gefunden werden
    }
}

async function resetCount(mode) {
    // Aktualisiere den Modus in der Datenbank
    await pool.query('UPDATE CurrentCount SET mode = ?', [mode]);
    // Generiere das Ziel basierend auf dem Modus
    const target = generateTarget(mode);
    // Setze den Zählstand auf 0
    await pool.query('TRUNCATE TABLE CurrentCount');
    // Füge das neue Ziel in die Datenbank ein
    await pool.query('INSERT INTO CurrentCount (number, senderId, target, mode) VALUES (0, NULL, ?, ?)', [target, mode]);
}

async function getTarget() {
    const [rows] = await pool.query('SELECT target FROM CurrentCount ORDER BY id ASC LIMIT 1');
    return rows.length > 0 ? rows[0].target : null;
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
