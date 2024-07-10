import { Responder, ResponderType } from "#base";
import { db } from "#database";
import { menus } from "#menus";
import { findChannel } from "@magicyan/discord";
import { ChannelType } from "discord.js";

new Responder({
  customId: "settings/:menu/:arg",
  type: ResponderType.Select, cache: "cached",
  async run(interaction, { menu, arg }) {
    const { client, guild } = interaction;

    const guildData = await db.guilds.get(guild.id);

    const [selected] = interaction.values;

    switch (menu) {
      case "channels": {
        interaction.update(menus.settings.channels.submenu(guildData, selected));
        return;
      }
      case "channel": {
        const { id, url } = findChannel(guild).byId(selected)!;
        await guildData.$set(`channels.${arg}`, { id, url }).save();

        interaction.update(menus.settings.channels.main(guildData));
        return;
      }
      case "parents": {
        interaction.update(menus.settings.parents.submenu(guildData, selected));
        return;
      }
      case "parent": {
        const { id, name } = findChannel(guild, ChannelType.GuildCategory).byId(selected)!;
        await guildData.$set(`parents.${arg}`, { id, name }).save();

        interaction.update(menus.settings.parents.main(guildData));
        return;
      }
      case "roles": {
        const current = guildData.tickets?.roles ?? [];
        switch (arg) {
          case "add": {
            current.push(...interaction.values);
            const updated = Array.from(new Set(current));
            guildData.$set("tickets.roles", updated);
            break;
          }
          case "remove": {
            const values = interaction.values;
            const filtered = current.filter(id => !values.includes(id));
            guildData.$set("tickets.roles", filtered);
            break;
          }
        }
        interaction.update(menus.settings.roles.main(guildData, guild));
        guildData.save();
        return;
      }
    }

  },
});