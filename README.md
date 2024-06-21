# Counting Discord Bot

## Introduction

This Discord bot facilitates a counting game within a designated channel in your server. Players take turns counting up based on specific rules for each round's mode. If a user counts incorrectly or out of turn, the bot resets the count and provides instructions for the new round.

## Features

- **Counting Modes:** Various modes such as positive, negative, multiples, primes, and binary numbers dictate how players count in each round.
- **Error Handling:** Detects invalid inputs and consecutive counts by the same user to maintain game integrity.
- **Interactive Commands:** Includes a /ping command to measure bot latency.
- **Tutorial Embeds:** Provides explanations for each mode via embedded messages.

## Setup

To run the bot locally or deploy it to a server, follow these steps:

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (Node Package Manager)
- MySQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/2000Arion/counting-discord-bot.git
cd counting-discord-bot
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

```env
TOKEN=your_discord_bot_token

CLIENT_ID=your_discord_client_id
COUNTING_GUILD_ID=your_discord_guild_id
COUNTING_CHANNEL_ID=your_discord_channel_id

DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_mysql_database_name

DEV=true_or_false
```

- `TOKEN`: Your Discord bot token obtained from the Discord Developer Portal.
- `CLIENT_ID`: The ID of your Discord bot client.
- `COUNTING_GUILD_ID`: The ID of the Discord guild where the bot operates.
- `COUNTING_CHANNEL_ID`: The ID of the channel where counting occurs.
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: MySQL database connection details.
- `DEV`: Optional variable to enable development/debug mode.

4. Initialize the database:

Run the SQL script provided (schema.sql) to set up the required tables in your MySQL database.

## Usage

Start the bot:

```bash
npm start
```

For development with automatic restart on file changes, use:

```bash
npm run dev
```

The bot will log in and be ready to operate in your Discord server.

## Commands
`/ping`: Responds with the bot's latency.

## Contributing

Contributions are welcome! If you have any suggestions or find issues, please create a [pull request](https://github.com/2000Arion/counting-discord-bot/pulls) or open an [issue](https://github.com/2000Arion/counting-discord-bot/issues/new/choose).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/2000Arion/counting-discord-bot/blob/dev/LICENSE) file for more details.

## Acknowledgments

- **Discord.js**: Discord API library for Node.js.
- **MySQL**: Database management system for storing game data.
- **dotenv**: Environment variable management for Node.js applications.
- **nodemon**: Development tool for auto-restarting the application on code changes.
