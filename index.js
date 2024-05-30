
// TODO: Fehler im Modus Binary beheben!

const { REST, Client, GatewayIntentBits, PresenceUpdateStatus, ActivityType, SlashCommandBuilder, Routes } = require('discord.js');
require('dotenv').config();

const { initializeDatabase, getLatestCount, getLatestSender, updateCount, getMode, resetCount, getTarget, isValidBinary } = require('./game/gameFunctions');
const { getModeTutorial } = require('./game/gameModeTutorials');
const getPing = require('./commands/getPing');

console.log('Loading...');

const client = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
});

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong!')
];

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.COUNTING_GUILD_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();

client.on('interaction', async (interaction) => {
    if (interaction.type === InteractionTypes.APPLICATION_COMMAND) {
        const commandName = interaction.commandName;

        if (commandName === 'ping') {
            await getPing(interaction); // Rufe die getPing-Funktion auf
        }
    }
});

client.on('ready', () => {
    client.user.setPresence({ activities: [{ name: 'in den Counting-Kanal', type: ActivityType.Watching }], status: PresenceUpdateStatus.Online });
    console.log(`Logged in as ${client.user.tag}`);
});

// Funktion, um einen zufälligen Modus auszuwählen
function getRandomMode() {
    const modes = ['all', 'positive_odd', 'positive_even', 'negative', 'tens', 'fifties', 'hundreds', 'multiples_3', 'multiples_4', 'negative_100_to_0', 'prime'];
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

            let resetMessage;
            switch (mode) {
                case 'positive_even':
                    resetMessage = 'Das Spiel beginnt wieder bei 2.';
                    break;
                case 'negative':
                    resetMessage = 'Das Spiel beginnt wieder bei -1.';
                    break;
                case 'tens':
                    resetMessage = 'Das Spiel beginnt wieder bei 10.';
                    break;
                case 'fifties':
                    resetMessage = 'Das Spiel beginnt wieder bei 50.';
                    break;
                case 'hundreds':
                    resetMessage = 'Das Spiel beginnt wieder bei 100.';
                    break;
                case 'multiples_3':
                    resetMessage = 'Das Spiel beginnt wieder bei 3.';
                    break;
                case 'multiples_4':
                    resetMessage = 'Das Spiel beginnt wieder bei 4.';
                    break;
                case 'negative_100_to_0':
                    resetMessage = 'Das Spiel beginnt wieder bei -100.';
                    break;
                case 'prime':
                    resetMessage = 'Das Spiel beginnt wieder bei 2.';
                    break;
                default:
                    resetMessage = 'Das Spiel beginnt wieder bei 1.';
                    break;
            }
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
                expectedCount = 1; // Start mit 1
            } else {
                expectedCount = latestCount + 2; // Nächste erwartete ungerade Zahl
            }
        } else if (mode === 'positive_even') {
            expectedCount = latestCount + 2; // Nächste erwartete gerade Zahl
        } else if (mode === 'negative') {
            expectedCount = latestCount - 1; // Nächste erwartete negative Zahl
        } else if (mode === 'tens') {
            if (latestCount === 0) {
                expectedCount = 10; // Start mit 10
            } else {
                expectedCount = latestCount + 10; // Nächste erwartete Zehnerzahl
            }
        } else if (mode === 'fifties') {
            if (latestCount === 0) {
                expectedCount = 50; // Start mit 50
            } else {
                expectedCount = latestCount + 50; // Nächste erwartete Fünftigerzahl
            }
        } else if (mode === 'hundreds') {
            if (latestCount === 0) {
                expectedCount = 100; // Start mit 100
            } else {
                expectedCount = latestCount + 100; // Nächste erwartete Hunderterzahl
            }
        } else if (mode === 'multiples_3') {
            if (latestCount === 0) {
                expectedCount = 3; // Start mit 3
            } else {
                expectedCount = latestCount + 3; // Nächstes erwartetes Vielfaches von 3
            }
        } else if (mode === 'multiples_4') {
            if (latestCount === 0) {
                expectedCount = 4; // Start mit 4
            } else {
                expectedCount = latestCount + 4; // Nächstes erwartetes Vielfaches von 4
            }
        } else if (mode === 'negative_100_to_0') {
            if (latestCount === 0) {
                expectedCount = -100; // Start mit -100
            } else {
                expectedCount = latestCount + 1; // Nächste erwartete Zahl von -100 zu 0
            }
        } else if (mode === 'prime') {
            if (latestCount <= 1) {
                expectedCount = 2; // Start mit 2
            } else {
                // Funktion, um die nächste Primzahl nach latestCount zu finden
                let isPrime = false;
                let candidate = latestCount + 1;
                while (!isPrime) {
                    isPrime = true;
                    for (let i = 2; i <= Math.sqrt(candidate); i++) {
                        if (candidate % i === 0) {
                            isPrime = false;
                            break;
                        }
                    }
                    if (!isPrime) candidate++;
                }
                expectedCount = candidate;
            }
        } else if (mode === 'binary') {
            let binaryCount = isValidBinary(latestCount) ? parseInt(latestCount, 2) : 0;

            // Berechnung der nächsten erwarteten binären Zahl
            if (binaryCount === 0) {
                expectedCount = '1'; // Start mit '1'
            } else {
                expectedCount = (binaryCount + 1).toString(2); // Nächste erwartete Binärzahl
            }
        } else {
            expectedCount = latestCount + 1; // Nächste erwartete Zahl im Standardmodus
        }

        if (message.author.id == latestSender && process.env.DEV != "true") {
            const mode = getRandomMode();
            const [tutorialTitle, tutorialDescription] = getModeTutorial(mode);
            await resetCount(mode);
            let target = await getTarget(); // Ziel nach dem Zurücksetzen aktualisieren
            await message.react('❌');

            let resetMessage;
            switch (mode) {
                case 'negative':
                    resetMessage = 'Das Spiel beginnt wieder bei -1.';
                    break;
                case 'tens':
                    resetMessage = 'Das Spiel beginnt wieder bei 10.';
                    break;
                case 'fifties':
                    resetMessage = 'Das Spiel beginnt wieder bei 50.';
                    break;
                case 'hundreds':
                    resetMessage = 'Das Spiel beginnt wieder bei 100.';
                    break;
                case 'multiples_3':
                    resetMessage = 'Das Spiel beginnt wieder bei 3.';
                    break;
                case 'multiples_4':
                    resetMessage = 'Das Spiel beginnt wieder bei 4.';
                    break;
                case 'negative_100_to_0':
                    resetMessage = 'Das Spiel beginnt wieder bei -100.';
                    break;
                case 'prime':
                    resetMessage = 'Das Spiel beginnt wieder bei 2.';
                    break;
                default:
                    resetMessage = 'Das Spiel beginnt wieder bei 1.';
                    break;
            }
            const errorMessage = target ? `Du darfst nicht mehrmals hintereinander zählen! ${resetMessage} In dieser Runde müsst ihr bis **${target}** zählen. (Modus: ${tutorialTitle})` : `Du darfst nicht mehrmals hintereinander zählen! ${resetMessage}`;
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
        } else if (userCount === expectedCount) {
            let target = await getTarget();
            await updateCount(userCount, message.author.id);
            if (userCount === target) {
                const mode = getRandomMode();
                const [tutorialTitle, tutorialDescription] = getModeTutorial(mode);
                await resetCount(mode);
                await message.react('🎉');
                let target = await getTarget();

                let resetMessage;
                switch (mode) {
                    case 'negative':
                        resetMessage = 'Das Spiel beginnt wieder bei -1.';
                        break;
                    case 'tens':
                        resetMessage = 'Das Spiel beginnt wieder bei 10.';
                        break;
                    case 'fifties':
                        resetMessage = 'Das Spiel beginnt wieder bei 50.';
                        break;
                    case 'hundreds':
                        resetMessage = 'Das Spiel beginnt wieder bei 100.';
                        break;
                    case 'multiples_3':
                        resetMessage = 'Das Spiel beginnt wieder bei 3.';
                        break;
                    case 'multiples_4':
                        resetMessage = 'Das Spiel beginnt wieder bei 4.';
                        break;
                    case 'negative_100_to_0':
                        resetMessage = 'Das Spiel beginnt wieder bei -100.';
                        break;
                    case 'prime':
                        resetMessage = 'Das Spiel beginnt wieder bei 2.';
                        break;
                    default:
                        resetMessage = 'Das Spiel beginnt wieder bei 1.';
                        break;
                }
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

            let resetMessage;
            switch (mode) {
                case 'negative':
                    resetMessage = 'Das Spiel beginnt wieder bei -1.';
                    break;
                case 'tens':
                    resetMessage = 'Das Spiel beginnt wieder bei 10.';
                    break;
                case 'fifties':
                    resetMessage = 'Das Spiel beginnt wieder bei 50.';
                    break;
                case 'hundreds':
                    resetMessage = 'Das Spiel beginnt wieder bei 100.';
                    break;
                case 'multiples_3':
                    resetMessage = 'Das Spiel beginnt wieder bei 3.';
                    break;
                case 'multiples_4':
                    resetMessage = 'Das Spiel beginnt wieder bei 4.';
                    break;
                case 'negative_100_to_0':
                    resetMessage = 'Das Spiel beginnt wieder bei -100.';
                    break;
                case 'prime':
                    resetMessage = 'Das Spiel beginnt wieder bei 2.';
                    break;
                default:
                    resetMessage = 'Das Spiel beginnt wieder bei 1.';
                    break;
            }
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
