import { Responder, ResponderType } from "#base";
import { db } from "#database";
import { menus } from "#menus";

new Responder({
  customId: "settings/:menu/:action",
  type: ResponderType.Button, cache: "cached",
  async run(interaction, { menu, action }) {
    const { client, guild } = interaction;

    const guildData = await db.guilds.get(guild.id);

    switch (menu) {
      case "roles": {
        switch (action) {
          case "add": {
            interaction.update(menus.settings.roles.add(guild));
            return;
          }
          case "remove": {
            interaction.update(menus.settings.roles.remove(guildData, guild));
            return;
          }
        }
      }
    }

  },
});