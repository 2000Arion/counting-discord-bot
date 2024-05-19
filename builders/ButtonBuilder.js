const { ButtonBuilder, ButtonStyle } = require('discord.js');

const confirmButton = new ButtonBuilder()
    .setCustomId('confirm_button')
    .setLabel('Erklärung')
    .setStyle(ButtonStyle.Secondary) // Grauer Button
    .setEmoji('❔');

module.exports = { confirmButton };
