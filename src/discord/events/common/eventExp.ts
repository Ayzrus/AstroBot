import { Event } from "#base";
import { db } from "#database";
import { brBuilder, createEmbed, findChannel } from "@magicyan/discord";
import { Message } from "discord.js";

new Event({
  name: "Event Exp",
  event: "messageCreate",
  async run(message: Message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const member = message.member;
    if (!member) return;

    let userData = await db.members.findOne({
      id: member.id,
      guildId: message.guild.id,
    });

    const guildData = await db.guilds.get(message.guild.id);

    if (!userData) {
      try {
        userData = await db.members.create({
          id: member.id,
          guildId: message.guild.id,
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

    const roleMultipliers = guildData.levelsystem?.roles || [];
    const memberRoles = member.roles.cache.map(role => role.id);

    let expMultiplier = 1;
    roleMultipliers.forEach(roleData => {
      if (memberRoles.includes(roleData.id)) {
        expMultiplier = Math.max(expMultiplier, roleData.multiplier);
      }
    });

    const baseExpGained = Math.floor(Math.random() * 10) + 1;

    const expGained = Math.floor(baseExpGained * expMultiplier);

    const newExp = userData.exp + expGained;

    let levelUp = false;
    let newLevel = userData.level;
    let newRequireExp = userData.requireExp;

    if (newExp >= userData.requireExp) {
      levelUp = true;
      newLevel += 1;
      newRequireExp = Math.floor(newRequireExp * 1.2);
    }

    await db.members.updateOne(
      { id: member.id, guildId: message.guild.id },
      {
        $set: {
          exp: newExp,
          level: newLevel,
          requireExp: newRequireExp,
        },
      }
    );

    if (levelUp) {
      await db.members.updateOne(
        { id: member.id, guildId: message.guild.id },
        {
          $set: {
            exp: 0,
          },
        }
      );

      const levelChannelId = guildData.channels?.level?.id ?? "";

      const levelChannel = findChannel(message.guild).byId(levelChannelId);

      if (!levelChannel) return;

      const allMembers = await db.members.find({ guildId: message.guild.id }).sort({ level: -1, exp: -1 });

      const embed = createEmbed({
        thumbnail: member.user.displayAvatarURL(),
        description: brBuilder(
          `||<@${member.id}>||`,
          `Parabéns você subiu para o nível ${newLevel}!`,
          `Exp necessário para o próximo nível: ${newRequireExp}`,
          `Você está no rank: ${allMembers.findIndex(m => m.id === member.id) + 1}`
        ),
        footer: { iconURL: message.guild.iconURL(), text: message.guild.name },
        timestamp: Date.now()
      });

      levelChannel.send({ embeds: [embed] });
    }
  },
});
