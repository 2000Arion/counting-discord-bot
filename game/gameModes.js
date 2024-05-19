// Funktionen für verschiedene Spielmodi

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTarget(mode) {
    if (mode === 'positive_odd') {
        return Math.floor(Math.random() * 100) * 2 + 1; // Zufällige ungerade positive Zahl zwischen 1 und 200
    } else if (mode === 'positive_even') {
        return Math.floor(Math.random() * 100) * 2; // Zufällige gerade positive Zahl zwischen 0 und 200
    } else if (mode === 'negative') {
        return -Math.floor(Math.random() * 100); // Zufällige negative Zahl zwischen -1 und -100
    } else {
        return Math.floor(Math.random() * 100) + 1; // Zufällige positive Zahl zwischen 1 und 100
    }
}

module.exports = {
    generateTarget
};
