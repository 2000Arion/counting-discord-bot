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
    } else if (mode === 'multiples_3') {
        return Math.floor(Math.random() * ((150 - 21) / 3 + 1)) * 3 + 21; // Zufällige Zahl zwischen 21 und 150
    } else if (mode === 'multiples_4') {
        return Math.floor(Math.random() * ((200 - 24) / 4 + 1)) * 4 + 24; // Zufällige Zahl zwishen 24 und 200
    } else if (mode === 'negative_100_to_0') {
        return -Math.floor(Math.random() * 101); // Zufällige negative Zahl zwischen -1 und -100
    } else if (mode === 'prime') {
        // Funktion zur Überprüfung, ob eine Zahl eine Primzahl ist
        function isPrime(num) {
            if (num <= 1) return false;
            if (num <= 3) return true;
            if (num % 2 === 0 || num % 3 === 0) return false;
            let i = 5;
            while (i * i <= num) {
                if (num % i === 0 || num % (i + 2) === 0) return false;
                i += 6;
            }
            return true;
        }

        let prime;
        do {
            prime = Math.floor(Math.random() * (293 - 19 + 1)) + 19;
        } while (!isPrime(prime));

        return prime;
    } else if (mode === 'binary') {
        // Generiere eine zufällige Dezimalzahl zwischen 10 und 100
        const randomNumber = Math.floor(Math.random() * 91) + 10;

        // Konvertiere die Dezimalzahl in eine Binärzahl
        const binaryNumber = randomNumber.toString(2);

        return binaryNumber;
    } else {
        return Math.floor(Math.random() * (200 - 10 + 1)) + 10; // Zufällige positive Zahl zwischen 10 und 200
    }
}

module.exports = {
    generateTarget
};
