import { Command } from "#base";
import { menus } from "#menus";
import { ApplicationCommandType } from "discord.js";

new Command({
  name: "configurações",
  description: "Comando de configurações do Bot.",
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    interaction.reply(menus.settings.main());
  }
});