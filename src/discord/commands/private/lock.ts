import { Command } from "#base";
import { sendCommandsLog } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType } from "discord.js";

new Command({
  name: "lock",
  description: "[🔒] Usado para bloquear um canal.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: "ManageChannels",
  options: [
    {
      name: "channel",
      description: "Selecione o canal a dar lock",
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
      channel.permissionOverwrites.create(guild.id, { SendMessages: false });

      const embed = createEmbed({
        color: settings.colors.azoxo,
        description: `${channel.url} foi locked com sucesso!`
      });

      sendCommandsLog({
        color: "warning",
        executor: interaction.member,
        guild: interaction.guild,
        title: "Logs de Lock",
        text: brBuilder(
          `${channel.url} foi locked com sucesso!`,
        )
      });

      await interaction.reply({ embeds: [embed] });

    }
    return;
  }
});