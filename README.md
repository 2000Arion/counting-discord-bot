# Counting Bot

Counting Bot ist ein Discord-Bot, der es ermöglicht, in verschiedenen Modi Zahlen zu zählen. Der Bot überwacht die Nachrichten in einem Kanal und überprüft, ob die eingetragenen Zahlen korrekt sind. Wenn eine falsche Zahl eingetragen wird, wird das Spiel zurückgesetzt.

## Funktionen

- Starten des Spiels mit verschiedenen Modi
- Automatisches Zurücksetzen bei falschen Zahlen
- Unterstützt mehrere Modi wie gerade Zahlen, ungerade Zahlen und negative Zahlen
- Berechtigungskontrollen für das Zurücksetzen und Starten des Spiels

## Voraussetzungen

- Node.js v14 oder höher
- Ein Discord-Bot-Token
- Ein `.env` Datei mit den folgenden Variablen:
  ```
    DATABASE_URL=[Database connection String](https://www.prisma.io/docs/concepts/database-connectors/mysql#connection-url)

    TOKEN=[your Discord Token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)

    PREFIX=c!
  ```

## Installation

1. Klone das Repository:
  ```sh
  git clone https://github.com/2000Arion/counting-bot.git
  cd counting-bot
  ```

2. Installiere die Abhängigkeiten:
  ```sh
  npm install
  ```

3. Erstelle eine `.env` Datei im Stammverzeichnis und füge deinen Bot-Token und Präfix hinzu:
  ```
    DATABASE_URL=[Database connection String](https://www.prisma.io/docs/concepts/database-connectors/mysql#connection-url)
    TOKEN=[your Discord Token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
    PREFIX=c!
  ```

4. Starte den Bot:
  ```sh
  npm start
  ```

## Nutzung

- Um das Spiel zu starten, verwende den Befehl: `c!start`
- Um den Zähler zurückzusetzen, verwende den Befehl: `c!reset`

## Beitrag leisten

Beiträge sind willkommen! Bitte eröffne ein Issue, um Fehler zu melden oder Features vorzuschlagen.

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Weitere Informationen findest du in der `LICENSE` Datei.
