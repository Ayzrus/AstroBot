import { Command } from "#base";
import { sendCommandsLog } from "#functions";
import { brBuilder } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType } from "discord.js";
import ms from "ms";

new Command({
  name: "slowmode",
  description: "[🔒] Usado para por slowmode em um canal.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: "ManageChannels",
  options: [
    {
      name: "tempo",
      description: "Coloque o tempo do modo lento [s|m|h|d] ([1s|1m|1h|1d]).",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "channel",
      description: "Selecione o canal a dar slowmode",
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText],
      required: false,
    }
  ],
  async run(interaction) {

    const { options } = interaction;

    const t = options.getString("tempo");

    if (!t) return;

    const tempo = ms(t);

    let channel = options.getChannel("channel");

    if (!channel || channel === null) channel = interaction.channel;

    if (!tempo || tempo === null) {
      interaction.reply({ ephemeral, content: "Insira um tempo valido: [s|m|h|d] ([1s|1m|1h|1d])" });
      return;
    }

    if (channel?.type === ChannelType.GuildText) {
      channel?.setRateLimitPerUser(tempo / 1000).then(() => {
        interaction.reply({ content: `O canal de texto ${channel?.url} teve seu modo lento definido para \`${t}\`.` });
        sendCommandsLog({
          color: "warning",
          executor: interaction.member,
          guild: interaction.guild,
          title: "Logs de Slowmode",
          text: brBuilder(
            `O canal de texto ${channel?.url} teve seu modo lento definido para \`${t}\`.`,
          )
        });
      }).catch(() => {
        interaction.reply({ content: "Ops, algo deu errado ao executar este comando, verifique as permissoes", ephemeral });
      });
    }

  }
});