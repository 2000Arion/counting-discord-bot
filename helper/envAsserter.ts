const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../.env');

const assertEnv = () => {
    if (!fs
        .readFileSync(envPath, 'utf-8')
        .includes('DATABASE_URL=')) {
        console.log(`DATABASE_URL not set. Please add your database URL to the .env file. This url should be a connection string to your database.
        \nif you dont know what this is, please refer to this documentation: https://www.prisma.io/docs/concepts/database-connectors/mysql#connection-url
        \nIf you want to use a different database provider (e.g. SQLite, PostgreSQL, etc.), please change the 'provider' field in the 'schema.prisma' file 
        accordingly.`);
        process.exit(1);
    }
    if (!fs
        .readFileSync(envPath, 'utf-8')
        .includes('TOKEN=')) {
        console.log(`TOKEN not set. Please add your bot token to the .env file. This token is required to authenticate your bot with Discord.
        \nIf you don't have a bot token yet, please refer to this documentation: https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot
        \nIf you have a bot token, please add it to the .env file`);
        process.exit(1);
    }
    if (!fs
        .readFileSync(envPath, 'utf-8')
        .includes('PREFIX=')) {
        console.log(`PREFIX not set. Please add your desired prefix to the .env file. This prefix is used to identify commands for your bot.
        \nIf you don't know what a prefix is, it is a character that is placed before a command to tell the bot that it is a command.
        \nFor example, if you set your prefix to '!', you would use commands like '!help' or '!ping'.
        \nPlease add your desired prefix to the .env file.`);
        process.exit(1);
    }
}

export default assertEnv;