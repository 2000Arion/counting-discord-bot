import {
  Client,
  GatewayIntentBits,
  PresenceUpdateStatus,
  ActivityType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from "discord.js";
require("dotenv").config();
import i18n from "./i18nConfig";

import getModeTutorial from "./game/gameModeTutorials";
import tutorialButton from "./builders/ButtonBuilder";

import assertEnv from "./helper/envAsserter";

import {
  getLatestCount,
  updateCount,
  getMode,
  resetCount,
  getTarget,
  getGameData,
  getLatestSender,
} from "./game/gameFunctions";

assertEnv();

const LANG = process.env.LANG || "en";
i18n.locale = LANG;

console.log(i18n.t("loading"));

const PREFIX = process.env.PREFIX;

if (!PREFIX) {
  console.log(i18n.t("error_prefix_not_defined"));
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.on("ready", () => {
  if (!client.user) {
    console.log(i18n.t("error_client_user_not_defined"));
    process.exit(1);
  }
  client.user.setPresence({
    activities: [
      { name: i18n.t("presence_activity"), type: ActivityType.Watching },
    ],
    status: PresenceUpdateStatus.Online,
  });
  console.log(i18n.t("logged_in_as", { user_tag: client.user.tag }));
});

function getRandomMode() {
  const modes = ["all", "positive_odd", "positive_even", "negative"];
  return modes[Math.floor(Math.random() * modes.length)];
}

client.on("messageCreate", async (message) => {
  if (!message) return;
  if (!message.channel) return;
  if (!message.guild) return;
  if (message.author.bot) return;

  const channel = message.channel;
  const guild = message.guild;

  if (!channel.id) return;
  if (!guild.id) return;

  if (message.content.startsWith(PREFIX)) {
    if (message.content === `${PREFIX}reset`) {
      const author = message.author;
      if (!author) return;
      if (!author.id) return;

      const member = guild.members.cache.get(author.id);

      if (!member) return;

      if (!member.permissions.has([PermissionsBitField.Flags.KickMembers])) {
        await message.channel.send(i18n.t("no_permission_reset"));
        return;
      }

      const mode = getRandomMode();
      const messageInformation = getModeTutorial(mode);
      await resetCount(mode, channel.id);
      const target = await getTarget(channel.id);
      await message.react("🔄");
      if (target) {
        await message.channel.send(
          i18n.t("counter_reset", {
            target,
            mode_title: messageInformation.title,
          })
        );
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
        await message.channel.send(i18n.t("no_permission_start"));
        return;
      }

      const mode = getRandomMode();
      const target = await updateCount(0, "", channel.id);
      const messageInformation = getModeTutorial(mode);
      await message.react("🎉");
      if (target) {
        await message.channel.send(
          i18n.t("game_started", {
            target,
            mode_title: messageInformation.title,
          })
        );
      }
      return;
    }
  }

  const game = await getGameData(channel.id);

  if (!game) return;

  const userCount = parseInt(message.content, 10);
  const mode = await getMode(channel.id);

  const lastCounter = await getLatestSender(channel.id);
  if (lastCounter === message.author.id) {
    await message.react("❌");
    const button = tutorialButton.setCustomId(mode);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    await message.channel.send({
      content: i18n.t("cannot_count_twice"),
      components: [row],
    });
    return;
  }

  if (isNaN(userCount) || message.content.trim() !== userCount.toString()) {
    const mode = getRandomMode();
    const messageInformation = getModeTutorial(mode);
    await resetCount(mode, channel.id);
    const target = await getTarget(channel.id);
    await message.react("❌");
    const resetMessage =
      mode === "negative"
        ? i18n.t("reset_message_negative")
        : i18n.t("reset_message_positive");
    const button = tutorialButton.setCustomId(mode);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    await message.channel.send({
      content: i18n.t("not_a_number", {
        reset_message: resetMessage,
        target,
        mode_title: messageInformation.title,
      }),
      components: [row],
    });
    return;
  }

  const latestCount = await getLatestCount(channel.id);

  let expectedCount;
  if (mode === "positive_odd") {
    if (latestCount === 0) {
      expectedCount = 1;
    } else {
      expectedCount = latestCount + 2;
    }
  } else if (mode === "positive_even") {
    expectedCount = latestCount + 2;
  } else if (mode === "negative") {
    expectedCount = latestCount - 1;
  } else {
    expectedCount = latestCount + 1;
  }

  if (userCount === expectedCount) {
    let target = await getTarget(channel.id);
    await updateCount(userCount, message.author.id, channel.id);
    if (userCount === target) {
      const mode = getRandomMode();
      const messageInformation = getModeTutorial(mode);
      await resetCount(mode, channel.id);
      await message.react("🎉");
      let target = await getTarget(channel.id);
      const resetMessage =
        mode === "negative"
          ? i18n.t("reset_message_negative")
          : i18n.t("reset_message_positive");
      const button = tutorialButton.setCustomId(mode);
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
      await message.channel.send({
        content: i18n.t("goal_reached", {
          reset_message: resetMessage,
          target,
          mode_title: messageInformation.title,
        }),
        components: [row],
      });
    } else {
      await message.react("✅");
    }
  } else {
    const mode = getRandomMode();
    const messageInformation = getModeTutorial(mode);
    await resetCount(mode, channel.id);
    let target = await getTarget(channel.id);
    await message.react("❌");
    const resetMessage =
      mode === "negative"
        ? i18n.t("reset_message_negative")
        : i18n.t("reset_message_positive");
    const button = tutorialButton.setCustomId(mode);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    await message.channel.send({
      content: i18n.t("wrong_number", {
        reset_message: resetMessage,
        target,
        mode_title: messageInformation.title,
      }),
      components: [row],
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const { customId, channel } = interaction;

  switch (customId) {
    case "all":
    case "positive_odd":
    case "positive_even":
    case "negative":
      const mode = customId;
      const messageInformation = getModeTutorial(mode);

      const embed = new EmbedBuilder()
        .setColor(0x31985)
        .setTitle(i18n.t("explanation_title"))
        .setDescription(messageInformation.description);

      await interaction.reply({ embeds: [embed], ephemeral: true });
      break;

    default:
      console.log(`Unhandled button click with customId: ${customId}`);
  }
});

client
  .login(process.env.TOKEN)
  .then(() => {
    console.log(i18n.t("bot_running"));
  })
  .catch((error) => {
    console.error("Error initializing the database:", error);
    process.exit(1);
  });
