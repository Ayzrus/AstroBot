import { Event } from "#base";
import { db } from "#database";
import { GuildMember } from "discord.js";

new Event({
  name: "Join Guild",
  event: "guildMemberAdd",
  async run(member: GuildMember) {
    console.log(`Novo membro entrou: ${member.user.tag}`);

    const userData = await db.members.findOne({
      id: member.id,
      guildId: member.guild.id,
    });

    if (!userData) {
      try {
        await db.members.create({
          id: member.id,
          guildId: member.guild.id,
          level: 0,
          exp: 0,
          requireExp: 100,
        });

        console.log(`Registro criado para o membro ${member.user.tag} na guilda ${member.guild.name}`);
      } catch (error) {
        console.error(`Erro ao criar registro para o membro ${member.user.tag}:`, error);
      }
    }
  },
});