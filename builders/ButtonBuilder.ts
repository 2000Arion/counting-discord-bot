import I18n from "../i18nConfig";

import { ButtonBuilder, ButtonStyle } from "discord.js";

const tutorialButton = new ButtonBuilder()
  .setCustomId("confirm_button")
  .setLabel(I18n.t("explanation_title"))
  .setStyle(ButtonStyle.Secondary) // Grauer Button
  .setEmoji("❔");

export default tutorialButton;
