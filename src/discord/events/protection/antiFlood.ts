import { Event } from "#base";
import { db } from "#database";
import { settings } from "#settings";
import { brBuilder, createEmbed } from "@magicyan/discord";
import { Collection, italic, Message } from "discord.js";

const members: Collection<string, number> = new Collection();

new Event({
  name: "Anti Flood",
  event: "messageCreate",
  async run(message: Message) {
    if (!message.inGuild()
      || message.author.bot
      || message.author.id === message.guild?.ownerId
      || message.member?.permissions.has("Administrator")) return;

    const { author, channel, member, guild } = message;

    if (!member) return;

    if (!guild) return;

    const guildData = await db.guilds.get(guild.id);

    if (guildData.antiflood) {

      const count = members.get(author.id);

      if (!count) {
        members.set(author.id, 1);
        return;
      }

      const newCount = count + 1;

      members.set(author.id, newCount);

      if (newCount > 2 && newCount < 4) {

        const embed = createEmbed({
          color: settings.colors.warning,
          description: brBuilder(
            `${author} evite flood de mensagens por favor!`,
            "Leia as regras do servidor para evitar punições"
          )
        });

        await channel.send({ content: `||${author}||`, embeds: [embed] });

      } else if (newCount >= 4) {
        members.delete(author.id);

        member?.timeout(60_000, "Flood de mensagens");

        let memberData = await db.members.findOne({
          id: member.user.id,
          guildId: guild.id,
        });

        if (!memberData) {
          try {
            memberData = await db.members.create({
              id: member.user.id,
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

        await db.members.updateOne(
          { id: member.id, guildId: guild.id },
          {
            $set: {
              warns: memberData.warns + 1
            },
          }
        );

        const embed = createEmbed({
          color: settings.colors.warning,
          description: brBuilder(
            `${author} Você tomou warn devido ao flood de mensagens!`,
            "Leia as regras do servidor para evitar punições",
            `${italic("Você podera enviar mensagens novamente em breve...")}`
          )
        });

        await channel.send({ content: `||${author}||`, embeds: [embed] });

      }

    }

  },
});