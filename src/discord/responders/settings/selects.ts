import { Responder, ResponderType } from "#base";
import { db } from "#database";
import { icon, res } from "#functions";
import { menus } from "#menus";
import { findChannel } from "@magicyan/discord";
import { ActionRowBuilder, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

new Responder({
  customId: "settings/:menu/:arg",
  type: ResponderType.Select, cache: "cached",
  async run(interaction, { menu, arg }) {
    const { guild } = interaction;

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
      case "levels": {
        const current: { id: string; multiplier: number }[] = guildData.levelsystem?.roles ?? [];
        switch (arg) {
          case "add": {
            const newRoles = interaction.values.map(id => ({ id, multiplier: 1 }));
            current.push(...newRoles);
            const updated = Array.from(new Set(current.map(role => role.id))).map(id => current.find(role => role.id === id)!);

            guildData.$set("levelsystem.roles", updated);
            break;
          }
          case "remove": {
            const values = interaction.values;
            const filtered = current.filter(role => !values.includes(role.id));
            guildData.$set("levelsystem.roles", filtered);
            break;
          }
          case "multiplier": {
            const roleId = interaction.values[0];
            const role = current.find(r => r.id === roleId);

            if (!role) return;

            const modal = new ModalBuilder({
              customId: `settings/levels/add-multiplier-${roleId}`,
              title: "Adicionar Multiplicador de EXP",
            });

            const input1 = new ActionRowBuilder<TextInputBuilder>({
              components: [
                new TextInputBuilder({
                  customId: "expMultiplier",
                  label: "Multiplicador de EXP",
                  placeholder: "Insira o multiplicador de EXP (ex: 1.5)",
                  style: TextInputStyle.Short,
                  required: true,
                  minLength: 1,
                }),
              ]
            });

            modal.setComponents(input1);

            interaction.showModal(modal);

            const modalInteraction = await interaction.awaitModalSubmit({
              filter: (i) => i.user.id == interaction.user.id,
              time: 0
            });

            if (!modalInteraction) return;

            const { fields } = modalInteraction;

            const expMultiplier = parseFloat(fields.getTextInputValue("expMultiplier"));

            if (!isNaN(expMultiplier)) {
              role.multiplier = expMultiplier;
              guildData.$set("levelsystem.roles", current);
              await guildData.save();
              await modalInteraction.reply({ content: `Multiplicador de EXP para o cargo atualizado para ${expMultiplier}.`, ephemeral: true });
            } else {
              await modalInteraction.reply({ content: "Valor inválido para o multiplicador de EXP.", ephemeral: true });
            }
            return;
          }
        }
        interaction.update(menus.settings.levels.main(guildData, guild));
        guildData.save();
        return;
      }
    }

  },
});