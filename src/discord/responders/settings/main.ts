import { Responder, ResponderType } from "#base";
import { db } from "#database";
import { menus } from "#menus";
import { createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle } from "discord.js";

new Responder({
  customId: "settings/:menu",
  type: ResponderType.Button, cache: "cached",
  async run(interaction, { menu }) {
    const { guild } = interaction;
    const guildData = await db.guilds.get(guild.id);

    switch (menu) {
      case "main": {
        interaction.update(menus.settings.main(guildData.antiflood));
        return;
      }
      case "roles": {
        interaction.update(menus.settings.roles.main(guildData, guild));
        return;
      }
      case "levels": {
        interaction.update(menus.settings.levels.main(guildData, guild));
        return;
      }
      case "channels": {
        interaction.update(menus.settings.channels.main(guildData));
        return;
      }
      case "parents": {
        interaction.update(menus.settings.parents.main(guildData));
        return;
      }
      case "anti": {
        if (!interaction.isButton()) return;

        const currentButton = interaction.component;

        if (!currentButton.emoji) return;

        const createAntiFloodRow = (isAntiFlood: boolean) => {
          return createRow(
            new ButtonBuilder({
              customId: "settings/channels",
              label: "Canais",
              emoji: "📖",
              style: ButtonStyle.Secondary
            }),
            new ButtonBuilder({
              customId: "settings/parents",
              label: "Categorias",
              emoji: "📑",
              style: ButtonStyle.Secondary
            }),
            new ButtonBuilder({
              customId: "settings/roles",
              label: "Cargos dos Tickets",
              emoji: "📗",
              style: ButtonStyle.Secondary
            }),
            new ButtonBuilder({
              customId: "settings/levels",
              label: "Cargos do Sistema de Level",
              emoji: "🆙",
              style: ButtonStyle.Secondary
            }),
            new ButtonBuilder({
              customId: "settings/anti",
              label: "Sistema anti-flood",
              emoji: isAntiFlood ? "✅" : "🚫",
              style: isAntiFlood ? ButtonStyle.Success : ButtonStyle.Danger
            })
          );
        };

        guildData.antiflood = !guildData.antiflood;
        const row = createAntiFloodRow(guildData.antiflood);
        await guildData.save();
        await interaction.update({ components: [row] });
      }
    }
  },
});