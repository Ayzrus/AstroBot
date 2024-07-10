import { GuildSchema } from "#database";
import { formatedChannelMention, icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ChannelSelectMenuBuilder, ChannelType, StringSelectMenuBuilder } from "discord.js";
import { settingsNav } from "./nav.js";

export const options = [
  { emoji: "📥", label: "Tickets", value: "tickets", description: "Categoria para novos Tickets" },
] as const;

export function settingsParentsMenu(guildData: GuildSchema) {
  const parents = guildData.parents ?? {};

  const display = options.map(({ emoji, label, value }) =>
    `- ${emoji} ${label} ${formatedChannelMention(parents[value]?.id ?? "`Não definido`")}`
  );

  const embed = createEmbed({
    color: settings.colors.primary,
    description: brBuilder(
      `# ${icon("gear")} Configurar Categorias`,
      display
    )
  });

  const row = createRow(
    new StringSelectMenuBuilder({
      customId: "settings/parents/select",
      placeholder: "Selecione o canal que deseja.",
      options: Array.from(options)
    })
  );

  const navRow = createRow(settingsNav.main);

  return { embeds: [embed], components: [row, navRow] };

}

export function settingsParentMenu(guildData: GuildSchema, selected: string) {
  const parents = (guildData.parents ?? {}) as Record<string, { id: string }>;

  const { emoji, label } = options.find(({ value }) => value === selected)!;

  const embed = createEmbed({
    color: settings.colors.warning,
    description: brBuilder(
      `${icon("pencil")} Alterar a Categoria ${emoji} ${label}`,
      `Atual: ${formatedChannelMention(parents[selected]?.id ?? "`Não definido`")}`
    )
  });

  const selectRow = createRow(
    new ChannelSelectMenuBuilder({
      customId: `settings/parent/${selected}`,
      placeholder: "Selecione a categoria que deseja definir!",
      channelTypes: [ChannelType.GuildCategory]
    })
  );

  const navRow = createRow(
    settingsNav.back("parents"),
    settingsNav.main
  );

  return { ephemeral, embeds: [embed], components: [selectRow, navRow] };
}