const { ButtonBuilder, ButtonStyle } = require('discord.js');

const tutorialButton = new ButtonBuilder()
    .setCustomId('confirm_button')
    .setLabel('Erklärung')
    .setStyle(ButtonStyle.Secondary) // Grauer Button
    .setEmoji('❔');

module.exports = { tutorialButton };
