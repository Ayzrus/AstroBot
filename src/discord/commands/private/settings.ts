import { Command } from "#base";
import { db } from "#database";
import { menus } from "#menus";
import { ApplicationCommandType } from "discord.js";

new Command({
  name: "configurações",
  description: "[🔒] Comando de configurações do Bot.",
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    const { guild } = interaction;
    const guildData = await db.guilds.get(guild.id);
    interaction.reply(menus.settings.main(guildData.antiflood));
  }
});