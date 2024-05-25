
// TODO: Button für Erklärung

const { Client, GatewayIntentBits, PresenceUpdateStatus, ActivityType } = require('discord.js');
require('dotenv').config();

const { initializeDatabase, getLatestCount, getLatestSender, updateCount, getMode, resetCount, getTarget } = require('./game/gameFunctions');
const { getModeTutorial } = require('./game/gameModeTutorials');

console.log('Loading...');

const client = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
});

client.on('ready', () => {
    client.user.setPresence({ activities: [{ name: 'in den Counting-Kanal', type: ActivityType.Watching }], status: PresenceUpdateStatus.Online });
    console.log(`Logged in as ${client.user.tag}`);
});

// Funktion, um einen zufälligen Modus auszuwählen
function getRandomMode() {
    const modes = ['all', 'positive_odd', 'positive_even', 'negative'];
    return modes[Math.floor(Math.random() * modes.length)];
}

client.on('messageCreate', async (message) => {
    if (message.channel.id === process.env.COUNTING_CHANNEL_ID && message.guild.id === process.env.COUNTING_GUILD_ID) {
        if (message.author.bot) return;

        const userCount = parseInt(message.content, 10);
        const mode = await getMode(); // Aktuellen Modus abrufen

        if (isNaN(userCount) || message.content.trim() !== userCount.toString()) {
            const mode = getRandomMode();
            const [tutorialTitle, tutorialDescription] = getModeTutorial(mode);
            await resetCount(mode);
            const target = await getTarget();
            await message.react('❌');

            const resetMessage = mode === 'negative' ? 'Das Spiel beginnt wieder bei -1.' : 'Das Spiel beginnt wieder bei 1.';
            const errorMessage = target ? `Das ist keine Zahl! ${resetMessage} In dieser Runde müsst ihr bis **${target}** zählen. (Modus: ${tutorialTitle})` : `Das ist keine Zahl! ${resetMessage}`;

            await message.channel.send({
                content: errorMessage,
                embeds: [
                    {
                        title: "Erklärung",
                        description: tutorialDescription,
                        color: 31985
                    }
                ],
            });
            return;
        }

        const latestCount = await getLatestCount();
        const latestSender = await getLatestSender();

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

        if (message.author.id == latestSender && process.env.DEV != "true") {
            const mode = getRandomMode();
            const [tutorialTitle, tutorialDescription] = getModeTutorial(mode);
            await resetCount(mode);
            let target = await getTarget(); // Ziel nach dem Zurücksetzen aktualisieren
            await message.react('❌');

            const resetMessage = mode === 'negative' ? 'Das Spiel beginnt wieder bei -1.' : 'Das Spiel beginnt wieder bei 1.';

            await message.channel.send({
                content: `Du darfst nicht mehrmals hintereinander zählen! ${resetMessage} In dieser Runde müsst ihr bis **${target}** zählen. (Modus: ${tutorialTitle})`,
                embeds: [
                    {
                        title: "Erklärung",
                        description: tutorialDescription,
                        color: 31985
                    }
                ],
            });
        } else if (userCount === expectedCount) {
            let target = await getTarget();
            await updateCount(userCount, message.author.id);
            if (userCount === target) {
                const mode = getRandomMode();
                const [tutorialTitle, tutorialDescription] = getModeTutorial(mode);
                await resetCount(mode);
                await message.react('🎉');
                let target = await getTarget();

                const resetMessage = mode === 'negative' ? 'Das Spiel beginnt jetzt wieder bei -1' : 'Das Spiel beginnt jetzt wieder bei 1';
                await message.channel.send({
                    content: `🎉 Herzlichen Glückwunsch! Das Ziel wurde erreicht.\n${resetMessage} und ihr müsst bis **${target}** zählen. Viel Glück! (Modus: ${tutorialTitle})`,
                    embeds: [
                        {
                            title: "Erklärung",
                            description: tutorialDescription,
                            color: 31985
                        }
                    ],
                });
            } else {
                await message.react('✅');
            }
        } else {
            const mode = getRandomMode();
            const [tutorialTitle, tutorialDescription] = getModeTutorial(mode);
            await resetCount(mode);
            let target = await getTarget(); // Ziel nach dem Zurücksetzen aktualisieren
            await message.react('❌');

            const resetMessage = mode === 'negative' ? 'Das Spiel beginnt wieder bei -1.' : 'Das Spiel beginnt wieder bei 1.';
            const errorMessage = target ? `Falsche Zahl! ${resetMessage} In dieser Runde müsst ihr bis **${target}** zählen. (Modus: ${tutorialTitle})` : `Falsche Zahl! ${resetMessage}`;

            await message.channel.send({
                content: errorMessage,
                embeds: [
                    {
                        title: "Erklärung",
                        description: tutorialDescription,
                        color: 31985
                    }
                ],
            });
        }
    }});

// Initialisiere die Datenbank und logge den Bot ein, wenn erfolgreich
initializeDatabase().then(() => {
    client.login(process.env.TOKEN).then(() => {
        console.log('Bot is running!'); // Wenn erfolgreich eingeloggt, 'Bot is running!' ausgeben
    }).catch(error => {
        console.error('Error starting the bot:', error);
        process.exit(1); // Beendet das Programm bei einem Einlogfehler
    });
}).catch(error => {
    console.error('Error initializing the database:', error);
    process.exit(1); // Beendet das Programm bei einem Initialisierungsfehler
});
