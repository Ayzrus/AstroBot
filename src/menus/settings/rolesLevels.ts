import { GuildSchema } from "#database";
import { getIncludeRoles, icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, Guild, RoleSelectMenuBuilder, StringSelectMenuBuilder } from "discord.js";
import { settingsNav } from "./nav.js";

export function settingsRolesLevelsMenu(guildData: GuildSchema, guild: Guild) {
  const roles = getIncludeRoles(guildData.levelsystem?.roles?.map(role => role.id), guild);

  const embed = createEmbed({
    color: settings.colors.primary,
    description: brBuilder(
      `# ${icon("gear")} Cargos do Sistema de Level`,
      "Cargos que ganham mais EXP no sistema de level",
      roles.size < 1 ? "Nenhum" :
        roles.map(role => {
          const roleData = guildData.levelsystem?.roles?.find(r => r.id === role.id);
          const multiplier = roleData ? roleData.multiplier : 1;

          return `- ${role} ${icon("account")} ${role.members.size} Membros. Multiplicador atual: ${multiplier}x`;
        })
    )
  });

  const row = createRow(
    new ButtonBuilder({ customId: "settings/levels/add", label: "Adicionar", style: ButtonStyle.Success }),
    new ButtonBuilder({ customId: "settings/levels/remove", label: "Remover", style: ButtonStyle.Danger, disabled: roles.size < 1 }),
    new ButtonBuilder({ customId: "settings/levels/multiplier", label: "Multiplicador do Cargo", style: ButtonStyle.Secondary, disabled: roles.size < 1 }),
  );
  const navRow = createRow(settingsNav.main);

  return { embeds: [embed], components: [row, navRow] };
}

export function settingsRolesLevelsAddMenu(guild: Guild) {
  const embed = createEmbed({
    color: settings.colors.success,
    description: "Selecione o cargo que deseja adicionar."
  });

  const row = createRow(
    new RoleSelectMenuBuilder({
      customId: "settings/levels/add",
      placeholder: "Selecione os Cargos",
      minValues: 1,
      maxValues: Math.min(25, guild.roles.cache.size)
    })
  );

  const navRow = createRow(
    settingsNav.back("levels"),
    settingsNav.main
  );

  return { embeds: [embed], components: [row, navRow] };

}

export function settingsRolesLevelsRemoveMenu(guildData: GuildSchema, guild: Guild) {
  const roles = getIncludeRoles(guildData.levelsystem?.roles?.map(role => role.id), guild);

  const embed = createEmbed({
    color: settings.colors.danger,
    description: "Selecione o cargo que deseja remover."
  });

  const row = createRow(
    new StringSelectMenuBuilder({
      customId: "settings/levels/remove",
      placeholder: "Selecione os Cargos",
      minValues: 1,
      maxValues: Math.min(25, roles.size),
      options: roles.first(25).map(role => ({
        label: role.name,
        value: role.id,
        description: `${role.members.size} Membros.`,
        emoji: icon("account")
      }))
    })
  );

  const navRow = createRow(
    settingsNav.back("levels"),
    settingsNav.main
  );

  return { embeds: [embed], components: [row, navRow] };

}

export function settingsRolesLevelsMultiplierMenu(guildData: GuildSchema, guild: Guild) {

  const roles = getIncludeRoles(guildData.levelsystem?.roles?.map(role => role.id), guild);

  const embed = createEmbed({
    color: settings.colors.danger,
    description: "Selecione o cargo que deseja adicionar multiplicador."
  });

  const row = createRow(
    new StringSelectMenuBuilder({
      customId: "settings/levels/multiplier",
      placeholder: "Selecione o Cargo",
      minValues: 1,
      maxValues: 1,
      options: roles.first(25).map(role => {
        const roleData = guildData.levelsystem?.roles?.find(r => r.id === role.id);
        const multiplier = roleData ? roleData.multiplier : 1;

        return {
          label: role.name,
          value: role.id,
          description: `${role.members.size} Membros. Multiplicador atual: ${multiplier}x`,
          emoji: icon("account")
        };
      })
    })
  );

  const navRow = createRow(
    settingsNav.back("levels"),
    settingsNav.main
  );

  return { embeds: [embed], components: [row, navRow] };

}