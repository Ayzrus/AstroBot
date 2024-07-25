import { Responder, ResponderType } from "#base";
import { sendCommandsLog } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createEmbedAuthor } from "@magicyan/discord";

new Responder({
  customId: "commands/users/select",
  type: ResponderType.Select, cache: "cached",
  async run(interaction) {

    const { values } = interaction;

    const [userId] = values;

    await interaction.guild.members.unban(userId).then(async () => {
      const embed = createEmbed({
        color: settings.colors.success,
        description: `O usuário com Id (\`${userId}\`) foi desbanido com sucesso!`,
        author: createEmbedAuthor(interaction.member, { prefix: "Desbanido por" }),
      });

      await interaction.reply({ ephemeral: true, embeds: [embed] });

      sendCommandsLog({
        color: "warning",
        executor: interaction.member,
        guild: interaction.guild,
        title: "Logs de Desbanimento",
        text: brBuilder(
          `O usuário com Id (\`${userId}\`) foi desbanido com sucesso!`,
        )
      });
    }).catch(async e => {
      const embedError = createEmbed({
        color: settings.colors.danger,
        description: `Não foi possível desbanir o usuário com Id (\`${userId}\`) do servidor! ${e}`,
      });
      await interaction.reply({ ephemeral: true, embeds: [embedError] });
    });

  },
});