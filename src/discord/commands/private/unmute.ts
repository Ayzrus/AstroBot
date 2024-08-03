import { Command } from "#base";
import { createRow } from "@magicyan/discord";
import { ApplicationCommandType, StringSelectMenuBuilder } from "discord.js";

new Command({
  name: "unmute",
  description: "[🔒] Usado para desmutar um utilizador.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: "MuteMembers",
  async run(interaction) {
    const { guild } = interaction;

    const muteRole = guild.roles.cache.find(r => r.name === "Astro_Muted");
    if (!muteRole) {
      return interaction.reply({ content: "Nenhum cargo de mute encontrado.", ephemeral: true });
    }

    const mutedMembers = guild.members.cache.filter(member => member.roles.cache.has(muteRole.id));

    if (mutedMembers.size === 0) {
      return interaction.reply({ content: "Não há usuários mutados.", ephemeral: true });
    }

    const row = createRow(
      new StringSelectMenuBuilder({
        customId: "muted/list",
        placeholder: "Selecione o usuário para desmutar.",
        options: mutedMembers.map(member => {
          return {
            label: member.user.username,
            value: member.id,
          };
        })
      })
    );

    return interaction.reply({ ephemeral, components: [row] });
  }
});
