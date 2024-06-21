const { EmbedBuilder } = require('discord.js');

module.exports = async (interaction) => {
    // Sende die initiale Antwort und warte auf die gesendete Nachricht
    const sent = await interaction.reply({ content: 'Ping wird ermittelt...', fetchReply: true, ephemeral: true });

    // Berechne den Ping
    const ping = sent.createdTimestamp - interaction.createdTimestamp;

    // Erstelle das Embed
    const embed = new EmbedBuilder()
        .setColor('#007DF1') // Verwende Hexadezimalfarbe
        .setTitle('Pong!')
        .setDescription(`Ping: \`${ping}ms\``)
        .setTimestamp();

    // Bearbeite die ursprüngliche Nachricht, um das Embed hinzuzufügen
    await interaction.editReply({ embeds: [embed] });
};
