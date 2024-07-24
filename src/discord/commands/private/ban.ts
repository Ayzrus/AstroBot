import { Command } from "#base";
import { settings } from "#settings";
import { brBuilder, createEmbed, createEmbedAuthor } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { sendCommandsLog } from "functions/commands/logs.js";

new Command({
  name: "ban",
  description: "Usado para Banir alguma pessoa que tenha quebrado alguma regra.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "Mencione um usuário para ser banido.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "motivo",
      description: "Insira um motivo.",
      type: ApplicationCommandOptionType.String,
      required: false,
    }
  ],
  async run(interaction) {

    const userOpt = interaction.options.getUser("user");

    if (!userOpt) return interaction.reply({ content: "Usuário é obrigatorio.", ephemeral: true });;

    const user = interaction.guild.members.cache.get(userOpt.id);

    if (!user) return interaction.reply({ content: "Usuário não encontrado.", ephemeral: true });;

    let motivo = interaction.options.getString("motivo");

    if (!motivo) motivo = "Não definido.";

    const embed = createEmbed({
      color: settings.colors.danger,
      description: `O usuário ${user} (\`${user.id}\`) foi banido com sucesso!`,
      author: createEmbedAuthor(interaction.member, { prefix: "Banido por" }),
    });

    sendCommandsLog({
      color: "warning",
      executor: interaction.member,
      guild: interaction.guild,
      title: "Logs de Banimento",
      text: brBuilder(
        `O usuário ${user} (\`${user.id}\`) foi banido com sucesso!`,
      )
    });

    user.ban({ reason: motivo }).then(() => {
      interaction.reply({ embeds: [embed] });
    }).catch(e => {
      const embedError = createEmbed({
        color: settings.colors.danger,
        description: `Não foi possível banir o usuário ${user} (\`${user.id}\`) do servidor! ${e}`,
      });
      interaction.reply({ embeds: [embedError] });
    });

    return;

  }
});