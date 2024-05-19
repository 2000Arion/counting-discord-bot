const { tutorialButton_all, tutorialButton_positive_odd, tutorialButton_positive_even, tutorialButton_negative } = require('../builders/ButtonBuilder');

function getModeTutorial(mode) {
    let tutorialTitle;
    let tutorialDescription;
    let row

    if (mode === 'all') {
        tutorialTitle = 'Positive Zahlen';
        tutorialDescription = 'Zähle einfach aufwärts von eins an: `1`, `2`, `3`, `4`, ...';
        row = new ActionRowBuilder().addComponents(tutorialButton_all);
    } else if (mode === 'positive_odd') {
        tutorialTitle = 'Ungerade Zahlen';
        tutorialDescription = 'Zähle nur die ungeraden Zahlen: `1`, `3`, `5`, `7`, ...';
        row = new ActionRowBuilder().addComponents(tutorialButton_positive_odd);
    } else if (mode === 'positive_even') {
        tutorialTitle = 'Gerade Zahlen';
        tutorialDescription = 'Zähle nur die geraden Zahlen: `2`, `4`, `6`, `8`, ...';
        row = new ActionRowBuilder().addComponents(tutorialButton_even);
    } else if (mode === 'negative') {
        tutorialTitle = 'Negative Zahlen';
        tutorialDescription = 'Zähle abwärts von null: `-1`, `-2`, `-3`, `-4`, ...';
        row = new ActionRowBuilder().addComponents(tutorialButton_negative);
    } else {
        // Wenn der Modus unbekannt ist, Standardwerte setzen
        tutorialTitle = 'Modus nicht gefunden';
        tutorialDescription = 'Bitte überprüfe den ausgewählten Modus.';
    }

    return [tutorialTitle, tutorialDescription, row];
}

module.exports = {
    getModeTutorial
}