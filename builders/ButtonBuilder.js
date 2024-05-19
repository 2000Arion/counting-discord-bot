const { ButtonBuilder, ButtonStyle } = require('discord.js');

const tutorialButton_all = new ButtonBuilder()
    .setCustomId('all')
    .setLabel('Erklärung')
    .setStyle(ButtonStyle.Secondary) // Grauer Button
    .setEmoji('❔');

const tutorialButton_positive_odd = new ButtonBuilder()
    .setCustomId('positive_odd')
    .setLabel('Erklärung')
    .setStyle(ButtonStyle.Secondary) // Grauer Button
    .setEmoji('❔');

const tutorialButton_positive_even = new ButtonBuilder()
    .setCustomId('positive_even')
    .setLabel('Erklärung')
    .setStyle(ButtonStyle.Secondary) // Grauer Button
    .setEmoji('❔');

const tutorialButton_negative = new ButtonBuilder()
    .setCustomId('negative')
    .setLabel('Erklärung')
    .setStyle(ButtonStyle.Secondary) // Grauer Button
    .setEmoji('❔');

module.exports = { tutorialButton_all, tutorialButton_positive_odd, tutorialButton_positive_even, tutorialButton_negative };
