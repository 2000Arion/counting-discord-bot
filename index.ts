import { Client, GatewayIntentBits, PresenceUpdateStatus, ActivityType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
require('dotenv').config();

import getModeTutorial from './game/gameModeTutorials';
import tutorialButton from './builders/ButtonBuilder';

import assertEnv from './helper/envAsserter';

import { getLatestCount, updateCount, getMode, resetCount, getTarget, getGameData, getLatestSender } from './game/gameFunctions';

assertEnv();

console.log('Loading...');

const PREFIX = process.env.PREFIX;

if (!PREFIX) {
    console.log('Error: Prefix is not defined');
    process.exit(1); // Beendet das Programm, wenn der Präfix nicht definiert ist
}

const client = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
});

client.on('ready', () => {
    if (!client.user) {
        console.log('Error: Client user is not defined');
        process.exit(1); // Beendet das Programm, wenn der Benutzer nicht definiert ist
    }
    client.user.setPresence({ activities: [{ name: 'in den Counting-Kanal', type: ActivityType.Watching }], status: PresenceUpdateStatus.Online });
    console.log(`Logged in as ${client.user.tag}`);
});

// Funktion, um einen zufälligen Modus auszuwählen
function getRandomMode() {
    const modes = ['all', 'positive_odd', 'positive_even', 'negative'];
    return modes[Math.floor(Math.random() * modes.length)];
}

client.on('messageCreate', async (message) => {
    if (!message) return; // wenn keine Nachricht vorhanden ist, beenden
    if (!message.channel) return; // wenn die Nachricht in keinem Kanal geschrieben wurde, beenden
    if (!message.guild) return; // wenn die Nachricht in keinem Server geschrieben wurde, beenden (z. B. DMs)
    if (message.author.bot) return; // wenn der Autor der Nachricht ein Bot ist, beenden
    const channel = message.channel; // Kanal, in dem die Nachricht gesendet wurde
    const guild = message.guild; // Server, in dem die Nachricht gesendet wurde

    if (!channel.id) return; // wenn keine Kanal-ID vorhanden ist, beenden
    if (!guild.id) return; // wenn keine Server-ID vorhanden ist, beenden

    if (message.content.startsWith(PREFIX)) {
        if (message.content === `${PREFIX}reset`) {
            const author = message.author;
            if (!author) return;
            if (!author.id) return;

            const member = guild.members.cache.get(author.id);

            if (!member) return;

            if (!member.permissions.has([PermissionsBitField.Flags.KickMembers])) {
                await message.channel.send('Du hast nicht die Berechtigung, den Zähler zurückzusetzen.');
                return;
            }

            const mode = getRandomMode();
            const messageInformation = getModeTutorial(mode);
            await resetCount(mode, channel.id);
            const target = await getTarget(channel.id);
            await message.react('🔄')
            if (target) {
                await message.channel.send(`Der Zähler wurde zurückgesetzt. In dieser Runde müsst ihr bis **${target}** zählen. (Modus: ${messageInformation.title})`);
            }
            return;
        }

        if (message.content === `${PREFIX}start`) {
            const author = message.author;
            if (!author) return;
            if (!author.id) return;

            const member = guild.members.cache.get(author.id);

            if (!member) return;

            if (!member.permissions.has([PermissionsBitField.Flags.KickMembers])) {
                await message.channel.send('Du hast nicht die Berechtigung, das Spiel zu starten.');
                return;
            }

            const mode = getRandomMode();
            const target = await updateCount(0, "", channel.id);
            const messageInformation = getModeTutorial(mode);
            await message.react('🎉');
            if (target) {
                await message.channel.send(`Das Spiel wurde gestartet! Ihr müsst bis **${target}** zählen. Viel Glück! (Modus: ${messageInformation.title})`);
            }
            return;
        }
    }

    const game = await getGameData(channel.id);

    if (!game) return;

    const userCount = parseInt(message.content, 10);
    const mode = await getMode(channel.id); // Aktuellen Modus abrufen

    const lastCounter = await getLatestSender(channel.id);
    if (lastCounter === message.author.id) {
        await message.react('❌');
        const button = tutorialButton.setCustomId(mode)
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
        await message.channel.send({
            content: 'Du kannst nicht zweimal hintereinander zählen!',
            components: [row]
        });
        return;
    }

    if (isNaN(userCount) || message.content.trim() !== userCount.toString()) {
        const mode = getRandomMode();
        const messageInformation = getModeTutorial(mode);
        await resetCount(mode, channel.id);
        const target = await getTarget(channel.id);
        await message.react('❌');
        const resetMessage = mode === 'negative' ? 'Das Spiel beginnt wieder bei -1.' : 'Das Spiel beginnt wieder bei 1.';
        const button = tutorialButton.setCustomId(mode)
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
        await message.channel.send({
            content: `Das ist keine Zahl! ${resetMessage} In dieser Runde müsst ihr bis **${target}** zählen. (Modus: ${messageInformation.title})`,
            components: [row]
        });
        return;
    }

    const latestCount = await getLatestCount(channel.id);

    // Überprüfen, ob die eingegebene Zahl basierend auf dem aktuellen Modus korrekt ist
    let expectedCount;
    if (mode === 'positive_odd') {
        if (latestCount === 0) {
            expectedCount = 1; // Start mit 1, da 0 keine ungerade Zahl ist
        } else {
            expectedCount = latestCount + 2; // Nächstes erwartetes ungerades Zahl
        }
    } else if (mode === 'positive_even') {
        expectedCount = latestCount + 2; // Nächstes erwartetes gerade Zahl
    } else if (mode === 'negative') {
        expectedCount = latestCount - 1; // Nächstes erwartetes negative Zahl
    } else {
        expectedCount = latestCount + 1; // Nächstes erwartetes Zahl im Standardmodus
    }

    if (userCount === expectedCount) {
        let target = await getTarget(channel.id);
        await updateCount(userCount, message.author.id, channel.id);
        if (userCount === target) {
            const mode = getRandomMode();
            const messageInformation = getModeTutorial(mode);
            await resetCount(mode, channel.id);
            await message.react('🎉');
            let target = await getTarget(channel.id);
            const resetMessage = mode === 'negative' ? 'Das Spiel beginnt jetzt wieder bei -1' : 'Das Spiel beginnt jetzt wieder bei 1';
            const button = tutorialButton.setCustomId(mode)
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
            await message.channel.send({
                content: `🎉 Herzlichen Glückwunsch! Das Ziel wurde erreicht.\n${resetMessage} und ihr müsst bis **${target}** zählen. Viel Glück! (Modus: ${messageInformation.title})`,
                components: [row]
            });
        } else {
            await message.react('✅');
        }
    } else {
        const mode = getRandomMode();
        const messageInformation = getModeTutorial(mode);
        await resetCount(mode, channel.id);
        let target = await getTarget(channel.id); // Ziel nach dem Zurücksetzen aktualisieren
        await message.react('❌');
        const resetMessage = mode === 'negative' ? 'Das Spiel beginnt wieder bei -1.' : 'Das Spiel beginnt wieder bei 1.';
        const button = tutorialButton.setCustomId(mode)
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
        await message.channel.send({
            content: `Falsche Zahl! ${resetMessage} In dieser Runde müsst ihr bis **${target}** zählen. (Modus: ${messageInformation.title})`,
            components: [row]
        });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const { customId, channel } = interaction;

    switch (customId) {
        case 'all':
        case 'positive_odd':
        case 'positive_even':
        case 'negative':
            const mode = customId;
            const messageInformation = getModeTutorial(mode);

            const embed = new EmbedBuilder()
                .setColor(0x31985)
                .setTitle("Erklärung")
                .setDescription(messageInformation.description);

            await interaction.reply({ embeds: [embed], ephemeral: true });
            break;

        // Add more cases for other buttons if needed
        default:
            console.log(`Unhandled button click with customId: ${customId}`);
    }
});


client.login(process.env.TOKEN).then(() => {
    console.log('Bot is running!'); // Wenn erfolgreich eingeloggt, 'Bot is running!' ausgeben
}).catch(error => {
    console.error('Error initializing the database:', error);
    process.exit(1); // Beendet das Programm bei einem Initialisierungsfehler
});
