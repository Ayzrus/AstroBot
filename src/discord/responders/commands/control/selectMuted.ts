import { Responder, ResponderType } from "#base";
import { sendCommandsLog } from "#functions";
import { brBuilder } from "@magicyan/discord";
import { GuildMember } from "discord.js";

new Responder({
  customId: "muted/list",
  type: ResponderType.Select, cache: "cached",
  async run(interaction) {

    const { values, guild } = interaction;
    const [userId] = values;

    if (!guild) return;

    const user = guild.members.cache.get(userId) as GuildMember;

    if (!user) {
      return interaction.reply({ content: "Usuário não encontrado.", ephemeral: true });
    }

    const muteRole = guild.roles.cache.find(r => r.name === "Astro_Muted");

    if (!muteRole) return;

    if (!user.roles.cache.has(muteRole.id)) {
      return interaction.reply({ content: "Usuário não está mutado.", ephemeral: true });
    }

    try {
      await user.roles.remove(muteRole);
      await interaction.reply({ content: `O usuário ${user.user.username}#${user.user.discriminator} foi desmutado com sucesso.`, ephemeral });
      await user.send({ content: `Você foi desmutado no servidor ${guild.name}` });
      sendCommandsLog({
        color: "warning",
        executor: interaction.member,
        guild: interaction.guild,
        title: "Logs de Unmute.",
        text: brBuilder(
          `O usuário ${interaction.member} desmutou ${user.displayName}.`,
        )
      });
    } catch (error) {
      return interaction.reply({ content: `Não foi possível desmutar o usuário: ${error}`, ephemeral: true });
    }

    return;

  },
});