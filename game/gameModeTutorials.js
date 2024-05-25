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
    } else if (mode === 'multiples_3') {
        tutorialTitle = 'Vielfache von 3';
        tutorialDescription = 'Zähle nur Vielfache von 3: `3`, `6`, `9`, `12`, ...';
    } else if (mode === 'multiples_4') {
        tutorialTitle = 'Vielfache von 4';
        tutorialDescription = 'Zähle nur Vielfache von 4: `4`, `8`, `12`, `16`, ...';
    } else if (mode === 'negative_100_to_0') {
        tutorialTitle = 'Von -100 bis 0';
        tutorialDescription = 'Zähle aufwärts von -100: `-100`, `-99`, `-98`, `-97`, ...';
    } else if (mode === 'prime') {
        tutorialTitle = 'Primzahlen';
        tutorialDescription = 'Zähle nur die Primzahlen: `2`, `3`, `5`, `7`, ...\n\n> **[Weitere Hilfe](https://media.arion2000.xyz/cdn/_uploads/html/source=018f9352-41c4-74cb-ad74-25f50db6578c/#/prime)**';
    } else if (mode === 'binary') {
        tutorialTitle = 'Binärzahlen';
        tutorialDescription = 'Zähle in Binärzahlen: `1`, `10`, `11`, `100`, ...\n\n> **[Weitere Hilfe](https://media.arion2000.xyz/cdn/_uploads/html/source=018f9352-41c4-74cb-ad74-25f50db6578c/#/binary)**';
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