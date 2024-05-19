import I18n from '../i18nConfig';

function getModeTutorial(mode: string) {
    let tutorialTitle: string;
    let tutorialDescription: string;

    if (mode === 'all') {
        tutorialTitle = I18n.t('positive_numbers.title');
        tutorialDescription = I18n.t('positive_numbers.description');
    } else if (mode === 'positive_odd') {
        tutorialTitle = I18n.t('positive_odd_numbers.title');
        tutorialDescription = I18n.t('positive_odd_numbers.description');
    } else if (mode === 'positive_even') {
        tutorialTitle = I18n.t('positive_even_numbers.title');
        tutorialDescription = I18n.t('positive_even_numbers.description');
    } else if (mode === 'negative') {
        tutorialTitle = I18n.t('negative_numbers.title');
        tutorialDescription = I18n.t('negative_numbers.description');
    } else {
        // Wenn der Modus unbekannt ist, Standardwerte setzen
        tutorialTitle = I18n.t('mode_not_found.title');
        tutorialDescription = I18n.t('mode_not_found.description');
    }

    return { title: tutorialTitle, description: tutorialDescription };
}

export default getModeTutorial;