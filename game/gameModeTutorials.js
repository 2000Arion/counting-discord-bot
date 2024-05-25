function getModeTutorial(mode) {
    let tutorialTitle;
    let tutorialDescription;

    if (mode === 'all') {
        tutorialTitle = 'Positive Zahlen';
        tutorialDescription = 'Zähle einfach aufwärts von eins an: `1`, `2`, `3`, `4`, ...';
    } else if (mode === 'positive_odd') {
        tutorialTitle = 'Ungerade Zahlen';
        tutorialDescription = 'Zähle nur die ungeraden Zahlen: `1`, `3`, `5`, `7`, ...';
    } else if (mode === 'positive_even') {
        tutorialTitle = 'Gerade Zahlen';
        tutorialDescription = 'Zähle nur die geraden Zahlen: `2`, `4`, `6`, `8`, ...';
    } else if (mode === 'negative') {
        tutorialTitle = 'Negative Zahlen';
        tutorialDescription = 'Zähle abwärts von null: `-1`, `-2`, `-3`, `-4`, ...';
    } else if (mode === 'tens') {
        tutorialTitle = 'Zehner';
        tutorialDescription = 'Zähle nur die Zehnerzahlen: `10`, `20`, `30`, `40`, ...';
    } else if (mode === 'fifties') {
        tutorialTitle = 'Fünfziger';
        tutorialDescription = 'Zähle nur die Fünfzigerzahlen: `50`, `100`, `150`, `200`, ...';
    } else if (mode === 'hundreds') {
        tutorialTitle = 'Hunderter';
        tutorialDescription = 'Zähle nur die Hunderterzahlen: `100`, `200`, `300`, `400`, ...';
    } else {
        // Wenn der Modus unbekannt ist, Standardwerte setzen
        tutorialTitle = 'Modus nicht gefunden';
        tutorialDescription = 'Bitte überprüfe den ausgewählten Modus.';
    }

    return [tutorialTitle, tutorialDescription];
}

module.exports = {
    getModeTutorial
}