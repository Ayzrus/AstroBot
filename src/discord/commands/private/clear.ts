import { Command } from "#base";
import { sendCommandsLog } from "#functions";
import { brBuilder, createEmbed, sleep } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } from "discord.js";

new Command({
  name: "clear",
  description: "[🔒] Usado para apagar mensagens do chat.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "quantidade",
      description: "Informe a quantidade de mensagens que deseja apagar.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  async run(interaction) {

    if (!interaction.channel) return;

    const amount = interaction.options.getInteger("quantidade");

    const response = new EmbedBuilder().setColor("Green");

    if (!amount) return;

    if (amount > 100 || amount < 1) return interaction.reply({ content: "**Informe um valor entre 1 e 100!**", ephemeral: true });

    interaction.channel.bulkDelete(amount, true).then(async (messages) => {
      response.setDescription(
        `**🪄 | Deletando __${messages.size}__ mensagens.**`
      );
      interaction.reply({
        embeds: [response],
      });
      await sleep(1000);
      sendCommandsLog({
        color: "warning",
        executor: interaction.member,
        guild: interaction.guild,
        title: "Logs de Clear de mensagens.",
        text: brBuilder(
          `O usuário ${interaction.member} apagou ${messages.size} mensagens do canal ${interaction.channel}`,
        )
      });
      const embed = createEmbed({
        color: "Green",
        description: `**🪄 | Foram deletadas __${messages.size}__ mensagens.**`,
        title: "Sucesso ao apagar as mensagens"
      });
      interaction.editReply({ embeds: [embed] });
    });

    return;

  }
});