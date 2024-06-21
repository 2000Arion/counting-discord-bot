# Counting Bot

Counting Bot is a Discord bot that allows users to count numbers in various modes. The bot monitors messages in a channel and checks if the entered numbers are correct. If an incorrect number is entered, the game is reset.

## Features

- Start a game with different modes
- Automatically reset the game when incorrect numbers are entered
- Supports multiple modes such as even numbers, odd numbers, and negative numbers
- Permission checks for resetting and starting the game

## Prerequisites

- Node.js v14 or higher
- A Discord bot token
- A `.env` file with the following variables:
  ```
    DATABASE_URL=[Database connection String](https://www.prisma.io/docs/concepts/database-connectors/mysql#connection-url)

    TOKEN=[your Discord Token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)

    PREFIX=c!
  ```

## Installation

1. Clone the repository:
  ```sh
  git clone https://github.com/your-username/counting-bot.git
  cd counting-bot
  ```

2. Install the dependencies:
  ```sh
  npm install
  ```

3. Create a `.env` file in the root directory and add your bot token and prefix:
  ```
    DATABASE_URL=[Database connection String](https://www.prisma.io/docs/concepts/database-connectors/mysql#connection-url)

    TOKEN=[your Discord Token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)

    PREFIX=c!
  ```

4. Start the bot:
  ```sh
  npm start
  ```

## Usage

- To start the game, use the command: `!start`
- To reset the counter, use the command: `!reset`

## Contributing

Contributions are welcome! Please open an issue to report bugs or suggest features.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
