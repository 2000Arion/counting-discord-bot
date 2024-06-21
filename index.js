const { REST, Client, GatewayIntentBits, PresenceUpdateStatus, ActivityType, SlashCommandBuilder, Routes, InteractionType } = require('discord.js');
require('dotenv').config();

const {
    initializeDatabase,
    getLatestCount,
    getLatestSender,
    updateCount,
    getMode,
    resetCount,
    getTarget,
    isValidBinary
} = require('./game/gameFunctions');
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

// Define reset message map outside the function
const resetMessageMap = {
    positive_even: 'Das Spiel beginnt wieder bei 2.',
    negative: 'Das Spiel beginnt wieder bei -1.',
    tens: 'Das Spiel beginnt wieder bei 10.',
    fifties: 'Das Spiel beginnt wieder bei 50.',
    hundreds: 'Das Spiel beginnt wieder bei 100.',
    multiples_3: 'Das Spiel beginnt wieder bei 3.',
    multiples_4: 'Das Spiel beginnt wieder bei 4.',
    negative_100_to_0: 'Das Spiel beginnt wieder bei -100.',
    prime: 'Das Spiel beginnt wieder bei 2.',
    binary: 'Das Spiel beginnt wieder bei 1.',
    default: 'Das Spiel beginnt wieder bei 1.',
};

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // Refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.COUNTING_GUILD_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

client.on('interactionCreate', async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
        const commandName = interaction.commandName;

        if (commandName === 'ping') {
            try {
                await getPing(interaction);
            } catch (error) {
                console.error('Error handling ping command:', error);
                await interaction.reply({ content: 'Ein Fehler ist aufgetreten!', ephemeral: true });
            }
        }
    }
});

client.on('ready', () => {
    client.user.setPresence({ activities: [{ name: 'in den Counting-Kanal', type: ActivityType.Watching }], status: PresenceUpdateStatus.Online });
    console.log(`Logged in as ${client.user.tag}`);
});

function getRandomMode() {
    const modes = ['all', 'positive_odd', 'positive_even', 'negative', 'tens', 'fifties', 'hundreds', 'multiples_3', 'multiples_4', 'negative_100_to_0', 'prime', 'binary'];
    return modes[Math.floor(Math.random() * modes.length)];
}

async function handleInvalidInput(message, mode) {
    const [tutorialTitle, tutorialDescription] = getModeTutorial(mode);
    await resetCount(mode);
    const target = await getTarget();
    await message.react('❌');

    // Check if the same user counted twice in a row
    const [latestCount, latestSender] = await Promise.all([getLatestCount(), getLatestSender()]);
    if (message.author.id === latestSender && process.env.DEV !== "true") {
        const errorMessage = `Du darfst nicht mehrmals hintereinander zählen! ${resetMessageMap[mode] || resetMessageMap.default} In dieser Runde müsst ihr bis **${target}** zählen. (Modus: ${tutorialTitle})`;

        await message.channel.send({
            content: errorMessage,
            embeds: [{
                title: "Erklärung",
                description: tutorialDescription,
                color: 31985
            }],
        });
    } else if (!isNaN(parseInt(message.content))) {
        // Check if the message content is a valid number
        const errorMessage = `Falsche Zahl! ${resetMessageMap[mode] || resetMessageMap.default} In dieser Runde müsst ihr bis **${target}** zählen. (Modus: ${tutorialTitle})`;

        await message.channel.send({
            content: errorMessage,
            embeds: [{
                title: "Erklärung",
                description: tutorialDescription,
                color: 31985
            }],
        });
    } else {
        // Default error message for non-numeric input
        const errorMessage = `Das ist keine Zahl! ${resetMessageMap[mode] || resetMessageMap.default} In dieser Runde müsst ihr bis **${target}** zählen. (Modus: ${tutorialTitle})`;

        await message.channel.send({
            content: errorMessage,
            embeds: [{
                title: "Erklärung",
                description: tutorialDescription,
                color: 31985
            }],
        });
    }
}

client.on('messageCreate', async (message) => {
    if (message.channel.id !== process.env.COUNTING_CHANNEL_ID || message.guild.id !== process.env.COUNTING_GUILD_ID) {
        return;
    }

    if (message.author.bot) {
        return;
    }

    const userCount = parseInt(message.content, 10);
    const mode = await getMode();

    if (isNaN(userCount) || message.content.trim() !== userCount.toString()) {
        const newMode = getRandomMode();
        await handleInvalidInput(message, newMode);
        return;
    }

    const [latestCount, latestSender] = await Promise.all([getLatestCount(), getLatestSender()]);

    const expectedCount = (() => {
        switch (mode) {
            case 'positive_odd':
                return latestCount === 0 ? 1 : latestCount + 2;
            case 'positive_even':
                return latestCount + 2;
            case 'negative':
                return latestCount - 1;
            case 'tens':
                return latestCount === 0 ? 10 : latestCount + 10;
            case 'fifties':
                return latestCount === 0 ? 50 : latestCount + 50;
            case 'hundreds':
                return latestCount === 0 ? 100 : latestCount + 100;
            case 'multiples_3':
                return latestCount === 0 ? 3 : latestCount + 3;
            case 'multiples_4':
                return latestCount === 0 ? 4 : latestCount + 4;
            case 'negative_100_to_0':
                return latestCount === 0 ? -100 : latestCount + 1;
            case 'prime':
                if (latestCount <= 1) return 2;
                let candidate = latestCount + 1;
                while (true) {
                    if (Array.from({ length: Math.floor(Math.sqrt(candidate)) }, (_, i) => i + 2).every(i => candidate % i !== 0)) {
                        return candidate;
                    }
                    candidate++;
                }
            case 'binary':
                const binaryCount = isValidBinary(latestCount) ? parseInt(latestCount, 2) : 0;
                return binaryCount === 0 ? '1' : (binaryCount + 1).toString(2);
            default:
                return latestCount + 1;
        }
    })();

    if (message.author.id == latestSender && process.env.DEV !== "true") {
        const newMode = getRandomMode();
        await handleInvalidInput(message, newMode);
    } else if (userCount.toString() === expectedCount.toString()) {
        const target = await getTarget();
        await updateCount(userCount, message.author.id);
        if (userCount === target) {
            const newMode = getRandomMode();
            const [tutorialTitle, tutorialDescription] = getModeTutorial(newMode);
            await resetCount(newMode);
            const newTarget = await getTarget();

            await message.channel.send({
                content: `🎉 Herzlichen Glückwunsch! Das Ziel wurde erreicht.\n${resetMessageMap[newMode] || resetMessageMap.default} und ihr müsst bis **${newTarget}** zählen. Viel Glück! (Modus: ${tutorialTitle})`,
                embeds: [{
                    title: "Erklärung",
                    description: tutorialDescription,
                    color: 31985
                }],
            });
            await message.react('🎉');
        } else {
            await message.react('✅');
        }
    } else {
        const newMode = getRandomMode();
        await handleInvalidInput(message, newMode);
    }
});

initializeDatabase().then(() => {
    client.login(process.env.TOKEN).then(() => {
        console.log('Bot is running!');
    }).catch(error => {
        console.error('Error starting the bot:', error);
        process.exit(1);
    });
}).catch(error => {
    console.error('Error initializing the database:', error);
    process.exit(1);
});
