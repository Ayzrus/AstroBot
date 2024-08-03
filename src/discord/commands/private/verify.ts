import { Command } from "#base";
import { icon } from "#functions";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChannelType } from "discord.js";

new Command({
  name: "verificacao",
  description: "[🔒] Usado para mandar o paneil de verificação.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: "Administrator",
  options: [
    {
      name: "channel",
      description: "Canal onde painel vai ser enviado",
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText],
      required: true
    },
  ],
  async run(interaction) {

    const { guild } = interaction;

    const channel = interaction.options.getChannel("channel", true, [ChannelType.GuildText]);

    if (!channel) return;

    const embed = createEmbed({
      title: "Sistema de verificação",
      description: brBuilder(
        "Para verificar-se clique no botão abaixo",
        "Será gerado um codigo e você tera que preencher um formulário"
      ),
      footer: { iconURL: guild.iconURL(), text: guild.name }
    });

    const row = createRow(
      new ButtonBuilder({
        customId: "verify-code-form",
        label: "Iniciar Verificação",
        emoji: icon("sucess"),
        style: ButtonStyle.Success
      })
    );
    interaction.reply({ ephemeral, content: "Painel enviado com sucesso!" });
    channel.send({ embeds: [embed], components: [row] });
    return;

  }
});