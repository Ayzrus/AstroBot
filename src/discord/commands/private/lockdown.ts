import { Command } from "#base";
import { sendCommandsLog } from "#functions";
import { brBuilder } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType } from "discord.js";

new Command({
  name: "lockdown",
  description: "[🔒] Comando de lockdown bloqueia todos os chats do servidor.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "state",
      description: "Escreve (true) para dar lockdown e (false) para desbloquear",
      type: ApplicationCommandOptionType.Boolean,
      required: true
    }
  ],
  defaultMemberPermissions: "ManageChannels",
  async run(interaction) {
    const { guild, options } = interaction;
    const value = options.getBoolean("state");

    // Itera sobre todos os canais de texto do servidor
    guild.channels.cache.forEach(async (channel) => {
      if (channel.type === ChannelType.GuildText) {
        // Obtém permissões atuais para a role @everyone
        const permissionOverwrites = channel.permissionOverwrites.cache.get(guild.roles.everyone.id);

        if (permissionOverwrites) {
          const canEdit = !permissionOverwrites.deny.has("SendMessages"); // Verifica se SEND_MESSAGES está negado

          if (value) {
            // Se for para bloquear, apenas remova a permissão de envio de mensagens
            if (canEdit) {
              await channel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: false });
            }
          } else {
            // Se for para desbloquear, restaure a permissão de envio de mensagens
            await channel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: true });
          }
        } else {
          // Se não houver permissões específicas definidas, aplique a configuração padrão
          await channel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: !value });
        }
      }
    });

    interaction.reply({ content: value ? "🔒 Servidor locked" : "🔓Servidor unlocked" });

    sendCommandsLog({
      color: "warning",
      executor: interaction.member,
      guild: interaction.guild,
      title: "Logs de lockdown",
      text: brBuilder(
        value ? "🔒 Servidor locked" : "🔓Servidor unlocked",
      )
    });

  }
});
