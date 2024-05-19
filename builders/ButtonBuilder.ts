import { ButtonBuilder, ButtonStyle } from 'discord.js';

const tutorialButton = new ButtonBuilder()
    .setCustomId('confirm_button')
    .setLabel('Erklärung')
    .setStyle(ButtonStyle.Secondary) // Grauer Button
    .setEmoji('❔');

export default tutorialButton;