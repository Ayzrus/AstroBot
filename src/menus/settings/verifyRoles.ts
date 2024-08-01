import { GuildSchema } from "#database";
import { getIncludeRoles, icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, Guild, RoleSelectMenuBuilder, StringSelectMenuBuilder } from "discord.js";
import { settingsNav } from "./nav.js";

export function settingsVerifyMenu(guilData: GuildSchema, guild: Guild) {
  const roles = getIncludeRoles(guilData.verify?.role, guild);

  const embed = createEmbed({
    color: settings.colors.primary,
    description: brBuilder(
      `# ${icon("gear")} Cargo do Verificar`,
      "Cargo do Verificado",
      roles.size < 1 ? "Nenhum" :
        roles.map(role => `- ${role} ${icon("account")} ${role.members.size} Membros.`)
    )
  });

  const row = createRow(
    new ButtonBuilder({ customId: "settings/verify/add", label: "Adicionar", style: ButtonStyle.Success }),
    new ButtonBuilder({ customId: "settings/verify/remove", label: "Remover", style: ButtonStyle.Danger, disabled: roles.size < 1 })
  );
  const navRow = createRow(settingsNav.main);

  return { embeds: [embed], components: [row, navRow] };
}

export function settingsVerifyAddMenu() {
  const embed = createEmbed({
    color: settings.colors.success,
    description: "Selecione o cargo que deseja adicionar."
  });

  const row = createRow(
    new RoleSelectMenuBuilder({
      customId: "settings/verify/add",
      placeholder: "Selecione o Cargo",
      minValues: 1,
      maxValues: 1
    })
  );

  const navRow = createRow(
    settingsNav.back("verify"),
    settingsNav.main
  );

  return { embeds: [embed], components: [row, navRow] };

}

export function settingsVerifyRemoveMenu(guilData: GuildSchema, guild: Guild) {
  const roles = getIncludeRoles(guilData.verify?.role, guild);

  const embed = createEmbed({
    color: settings.colors.danger,
    description: "Selecione o cargo que deseja remover."
  });

  const row = createRow(
    new StringSelectMenuBuilder({
      customId: "settings/verify/remove",
      placeholder: "Selecione o Cargo",
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
    settingsNav.back("verify"),
    settingsNav.main
  );

  return { embeds: [embed], components: [row, navRow] };

}