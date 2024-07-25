import { Command } from "#base";
import { menus } from "#menus";
import { ApplicationCommandType } from "discord.js";

new Command({
  name: "desbanir",
  description: "[🔒] Comando para desbanir um utilizador.",
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {

    const { guild } = interaction;

    interaction.reply(menus.commands.main(guild));
  }
});