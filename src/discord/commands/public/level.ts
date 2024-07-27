import { Command } from "#base";
import { db } from "#database";
import { brBuilder, createEmbed, findMember } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

new Command({
  name: "level",
  description: "Usa para veres teu level ou level de outra pessoa",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "target-user",
      description: "Vê o level de uma pessoa",
      type: ApplicationCommandOptionType.User
    }
  ],
  async run(interaction) {

    const { guild, member } = interaction;

    const userMentioned = interaction.options.getUser("target-user") || member.user;

    const targetUserId = userMentioned.id;

    const targetUserObj = findMember(guild).byId(targetUserId);

    let fetchedLevel = await db.members.findOne({
      id: targetUserId,
      guildId: guild.id,
    });

    if (!fetchedLevel) {
      try {
        fetchedLevel = await db.members.create({
          id: targetUserObj?.id,
          guildId: guild.id,
          level: 0,
          exp: 0,
          requireExp: 100,
          warns: 0,
        });

        console.log(`Registro criado para o membro ${member.user.tag} na guilda ${member.guild.name}`);
      } catch (error) {
        console.error(`Erro ao criar registro para o membro ${member.user.tag}:`, error);
        return;
      }
    }

    const allMembers = await db.members.find({ guildId: guild.id }).sort({ level: -1, exp: -1 });

    const embed = createEmbed({
      thumbnail: targetUserObj?.displayAvatarURL(),
      description: brBuilder(
        `||<@${targetUserObj?.id}>||`,
        `O utilizador se encontra no nível: ${fetchedLevel?.level}!`,
        `Falta : ${Number(fetchedLevel?.requireExp) - Number(fetchedLevel?.exp)} de exp para o próximo nível.`,
        `Posição atual no rank: ${allMembers.findIndex(m => m.id === targetUserObj?.id) + 1}`
      ),
      footer: { iconURL: guild.iconURL(), text: guild.name },
      timestamp: Date.now()
    });

    interaction.reply({ embeds: [embed] });

    return;

  }
});