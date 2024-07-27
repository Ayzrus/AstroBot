import { Command } from "#base";
import { sendCommandsLog } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createEmbedAuthor } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

new Command({
  name: "kick",
  description: "[🔒] Usado para Expulsar alguma pessoa da comunidade.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "Mencione um usuário para ser expulso.",
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
      description: `O usuário ${user} (\`${user.id}\`) foi expulso com sucesso!`,
      author: createEmbedAuthor(interaction.member, { prefix: "Expulso por" }),
    });

    user.kick(motivo).then(() => {
      interaction.reply({ ephemeral: true, embeds: [embed] });
      sendCommandsLog({
        color: "warning",
        executor: interaction.member,
        guild: interaction.guild,
        title: "Logs de Expulsão",
        text: brBuilder(
          `O usuário ${user} (\`${user.id}\`) foi expulso com sucesso!`,
        )
      });
    }).catch(e => {
      const embedError = createEmbed({
        color: settings.colors.danger,
        description: `Não foi possível expulsar o usuário ${user} (\`${user.id}\`) do servidor! ${e}`,
      });
      interaction.reply({ ephemeral: true, embeds: [embedError] });
    });

    return;

  }
});