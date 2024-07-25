import { Command } from "#base";
import { db } from "#database";
import { findMember } from "@magicyan/discord";
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

    const fetchedLevel = await db.members.findOne({
      id: targetUserId,
      guildId: guild.id,
    });
    return;

  }
});