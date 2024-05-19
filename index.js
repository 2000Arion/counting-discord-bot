
// TODO: Falsch, wenn eine Person 2 Nachrichten hintereinander sendet

const { Client, GatewayIntentBits, PresenceUpdateStatus, ActivityType, ActionRowBuilder } = require('discord.js');
require('dotenv').config();

const { initializeDatabase, getLatestCount, updateCount, getMode, resetCount, getTarget } = require('./game/gameFunctions');
const { tutorialButton } = require('./builders/ButtonBuilder');

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

function getModeTutorial(mode) {
    let tutorialTitle;
    let tutorialDescription;

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

    return [tutorialTitle, tutorialDescription];
}

client.on('messageCreate', async (message) => {
    if (message.channel.id === '1241721012500959264' && message.guild.id === '831161440705839124') {
        if (message.author.bot) return;

        const userCount = parseInt(message.content, 10);
        const mode = await getMode(); // Aktuellen Modus abrufen

        if (isNaN(userCount) || message.content.trim() !== userCount.toString()) {
            const mode = getRandomMode();
            const [tutorialTitle, tutorialDescription] = getModeTutorial(mode);
            await resetCount(mode);
            const target = await getTarget();
            await message.react('❌');

            const row = new ActionRowBuilder()
                .addComponents(tutorialButton);

            if (target) {
                const resetMessage = mode === 'negative' ? 'Das Spiel beginnt wieder bei -1.' : 'Das Spiel beginnt wieder bei 1.';
                await message.channel.send({
                    content: `Das ist keine Zahl! ${resetMessage} In dieser Runde müsst ihr bis **${target}** zählen. (Modus: ${tutorialTitle})`,
                    components: [row],
                });
            } else {
                const resetMessage = mode === 'negative' ? 'Das Spiel beginnt wieder bei -1.' : 'Das Spiel beginnt wieder bei 1.';
                await message.channel.send({
                    content: `Das ist keine Zahl! ${resetMessage} (Modus: ${tutorialTitle})`,
                    components: [row],
                });
            }
            return;
        }

        const latestCount = await getLatestCount();

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
            let target = await getTarget();
            await updateCount(userCount, message.author.id);
            if (userCount === target) {
                const mode = getRandomMode();
                const [tutorialTitle, tutorialDescription] = getModeTutorial(mode);
                await resetCount(mode);
                await message.react('🎉');
                let target = await getTarget();

                const row = new ActionRowBuilder()
                    .addComponents(tutorialButton);

                const resetMessage = mode === 'negative' ? 'Das Spiel beginnt jetzt wieder bei -1' : 'Das Spiel beginnt jetzt wieder bei 1';
                await message.channel.send({
                    content: `🎉 Herzlichen Glückwunsch! Das Ziel wurde erreicht.\n${resetMessage} und ihr müsst bis **${target}** zählen. Viel Glück! (Modus: ${tutorialTitle})`,
                    components: [row],
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

            const row = new ActionRowBuilder()
                    .addComponents(tutorialButton);

            if (target) {
                const resetMessage = mode === 'negative' ? 'Das Spiel beginnt wieder bei -1.' : 'Das Spiel beginnt wieder bei 1.';
                await message.channel.send({
                    content: `Falsche Zahl! ${resetMessage} In dieser Runde müsst ihr bis **${target}** zählen. (Modus: ${tutorialTitle})`,
                    components: [row],
            });
            } else {
                const resetMessage = mode === 'negative' ? 'Das Spiel beginnt wieder bei -1.' : 'Das Spiel beginnt wieder bei 1.';
                await message.channel.send({
                    content: `Falsche Zahl! ${resetMessage} (Modus: ${tutorialTitle})`,
                    components: [row],
            });
            }
        }
    }
});

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
