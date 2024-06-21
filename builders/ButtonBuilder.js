const { ButtonBuilder, ButtonStyle } = require('discord.js');

const tutorialButton_prime = new ButtonBuilder()
    .setLabel('Weitere Hilfe')
    .setURL('https://media.arion2000.xyz/cdn/_uploads/html/source=018f9352-41c4-74cb-ad74-25f50db6578c/#/prime')
    .setStyle(ButtonStyle.Link)

const tutorialButton_roman = new ButtonBuilder()
    .setLabel('Weitere Hilfe')
    .setURL('https://media.arion2000.xyz/cdn/_uploads/html/source=018f9352-41c4-74cb-ad74-25f50db6578c/#/roman')
    .setStyle(ButtonStyle.Link)

const tutorialButton_binary = new ButtonBuilder()
    .setLabel('Weitere Hilfe')
    .setURL('https://media.arion2000.xyz/cdn/_uploads/html/source=018f9352-41c4-74cb-ad74-25f50db6578c/#/binary')
    .setStyle(ButtonStyle.Link)

module.exports = { tutorialButton_prime, tutorialButton_roman, tutorialButton_binary };
