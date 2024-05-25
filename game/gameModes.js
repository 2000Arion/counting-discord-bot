// Funktionen für verschiedene Spielmodi

function getRandomInt(min, max) {
    // Wird nicht verwendet!
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTarget(mode) {
    if (mode === 'positive_odd') {
        return Math.floor(Math.random() * 100) * 2 + 1; // Zufällige ungerade positive Zahl zwischen 1 und 200
    } else if (mode === 'positive_even') {
        return Math.floor(Math.random() * 100) * 2; // Zufällige gerade positive Zahl zwischen 0 und 200
    } else if (mode === 'negative') {
        return -Math.floor(Math.random() * 100); // Zufällige negative Zahl zwischen -1 und -100
    } else if (mode === 'tens') {
        return Math.floor(Math.random() * ((800 - 300) / 10 + 1)) * 10 + 300; // Zufällige Zahl zwischen 300 und 800
    } else if (mode === 'fifties') {
        return Math.floor(Math.random() * ((2000 - 500) / 50 + 1)) * 50 + 500; // Zufällige Zahl zwischen 500 und 2000
    } else if (mode === 'hundreds') {
        return Math.floor(Math.random() * ((10000 - 1000) / 100 + 1)) * 100 + 1000; // Zufällige Zahl zwischen 1000 und 10000
    } else {
        return Math.floor(Math.random() * (200 - 10 + 1)) + 10; // Zufällige positive Zahl zwischen 10 und 200
    }
}

module.exports = {
    generateTarget
};
