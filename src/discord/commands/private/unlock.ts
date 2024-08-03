import { Command } from "#base";
import { sendCommandsLog } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType } from "discord.js";

new Command({
  name: "unlock",
  description: "[🔒] Usado para desbloquear um canal.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: "ManageChannels",
  options: [
    {
      name: "channel",
      description: "Selecione o canal a dar unlock",
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText],
      required: true,
    }
  ],
  async run(interaction) {

    const { guild, options } = interaction;

    const channel = options.getChannel("channel");

    if (!channel) return;

    if (channel.type === ChannelType.GuildText) {
      channel.permissionOverwrites.create(guild.id, { SendMessages: true });

      const embed = createEmbed({
        color: settings.colors.azoxo,
        description: `${channel.url} foi unlocked com sucesso!`
      });

      sendCommandsLog({
        color: "warning",
        executor: interaction.member,
        guild: interaction.guild,
        title: "Logs de Unlock",
        text: brBuilder(
          `${channel.url} foi unlocked com sucesso!`,
        )
      });

      await interaction.reply({ embeds: [embed] });

    }
    return;
  }
});