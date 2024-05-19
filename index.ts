
// TODO: Falsch, wenn eine Person 2 Nachrichten hintereinander sendet

import { Client, GatewayIntentBits, PresenceUpdateStatus, ActivityType } from 'discord.js';
require('dotenv').config();

import { getLatestCount, updateCount, getMode, resetCount, getTarget, getGameData } from './game/gameFunctions';

console.log('Loading...');

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

function getModeTutorial(mode: string) {
    let tutorialTitle: string;
    let tutorialDescription: string;

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
    } else {
        // Wenn der Modus unbekannt ist, Standardwerte setzen
        tutorialTitle = 'Modus nicht gefunden';
        tutorialDescription = 'Bitte überprüfe den ausgewählten Modus.';
    }

    return { title: tutorialTitle, description: tutorialDescription };
}

client.on('messageCreate', async (message) => {
    if (!message) return;
    if (!message.channel) return;
    if (!message.guild) return;
    if (message.author.bot) return;

    const channel = message.channel;
    const guild = message.guild;

    if (!channel.id) return;
    if (!guild.id) return;


    const game = await getGameData(channel.id);

    if (!game) return;


    const userCount = parseInt(message.content, 10);
    const mode = await getMode(channel.id); // Aktuellen Modus abrufen

    if (isNaN(userCount) || message.content.trim() !== userCount.toString()) {
        const mode = getRandomMode();
        const messageInformation = getModeTutorial(mode);
        await resetCount(mode, channel.id);
        const target = await getTarget(channel.id);
        await message.react('❌');
        if (target) {
            const resetMessage = mode === 'negative' ? 'Das Spiel beginnt wieder bei -1.' : 'Das Spiel beginnt wieder bei 1.';
            await message.channel.send(`Das ist keine Zahl! ${resetMessage} In dieser Runde müsst ihr bis **${target}** zählen. (Modus: ${messageInformation.title})`);
        } else {
            const resetMessage = mode === 'negative' ? 'Das Spiel beginnt wieder bei -1.' : 'Das Spiel beginnt wieder bei 1.';
            await message.channel.send(`Das ist keine Zahl! ${resetMessage} (Modus: ${messageInformation.title})`);
        }
        return;
    }

    const latestCount = await getLatestCount(channel.id);

    // Überprüfen, ob die eingegebene Zahl basierend auf dem aktuellen Modus korrekt ist
    let expectedCount: number;
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
            await message.channel.send(`🎉 Herzlichen Glückwunsch! Das Ziel wurde erreicht.\n${resetMessage} und ihr müsst bis **${target}** zählen. Viel Glück! (Modus: ${messageInformation.title})`);
        } else {
            await message.react('✅');
        }
    } else {
        const mode = getRandomMode();
        const messageInformation = getModeTutorial(mode);
        await resetCount(mode, channel.id);
        let target = await getTarget(channel.id); // Ziel nach dem Zurücksetzen aktualisieren
        await message.react('❌');
        if (target) {
            const resetMessage = mode === 'negative' ? 'Das Spiel beginnt wieder bei -1.' : 'Das Spiel beginnt wieder bei 1.';
            await message.channel.send(`Falsche Zahl! ${resetMessage} In dieser Runde müsst ihr bis **${target}** zählen. (Modus: ${messageInformation.title})`);
        } else {
            const resetMessage = mode === 'negative' ? 'Das Spiel beginnt wieder bei -1.' : 'Das Spiel beginnt wieder bei 1.';
            await message.channel.send(`Falsche Zahl! ${resetMessage} (Modus: ${messageInformation.title})`);
        }
    }
});

client.login(process.env.TOKEN).then(() => {
    console.log('Bot is running!'); // Wenn erfolgreich eingeloggt, 'Bot is running!' ausgeben
}).catch(error => {
    console.error('Error initializing the database:', error);
    process.exit(1); // Beendet das Programm bei einem Initialisierungsfehler
});
