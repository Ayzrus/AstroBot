import { GuildSchema } from "#database";
import { formatedChannelMention, icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ChannelSelectMenuBuilder, ChannelType, StringSelectMenuBuilder } from "discord.js";
import { settingsNav } from "./nav.js";

export const options = [
  { emoji: "📨", label: "Logs do Bot", value: "logs", description: "Canal de logs Bot" },
  { emoji: "📩", label: "Transcripts", value: "transcripts", description: "Canal de logs Bot" },
] as const;

export function settingsChannelsMenu(guildData: GuildSchema) {
  const channels = guildData.channels ?? {};

  const display = options.map(({ emoji, label, value }) =>
    `- ${emoji} ${label} ${formatedChannelMention(channels[value]?.id ?? "`Não definido`")}`
  );

  const embed = createEmbed({
    color: settings.colors.primary,
    description: brBuilder(
      `# ${icon("gear")} Configurar Canais`,
      display
    )
  });

  const row = createRow(
    new StringSelectMenuBuilder({
      customId: "settings/channels/select",
      placeholder: "Selecione o canal que deseja.",
      options: Array.from(options)
    })
  );

  const navRow = createRow(settingsNav.main);

  return { embeds: [embed], components: [row, navRow] };

}

export function settingsChannelMenu(guildData: GuildSchema, selected: string) {
  const channels = (guildData.channels ?? {}) as Record<string, { id: string }>;

  const { emoji, label } = options.find(({ value }) => value === selected)!;

  const embed = createEmbed({
    color: settings.colors.warning,
    description: brBuilder(
      `${icon("pencil")} Alterar o Canal ${emoji} ${label}`,
      `Atual: ${formatedChannelMention(channels[selected]?.id ?? "`Não definido`")}`
    )
  });

  const selectRow = createRow(
    new ChannelSelectMenuBuilder({
      customId: `settings/channel/${selected}`,
      placeholder: "Selecione o canal que deseja definir",
      channelTypes: [ChannelType.GuildText]
    })
  );

  const navRow = createRow(
    settingsNav.back("channels"),
    settingsNav.main
  );

  return { ephemeral, embeds: [embed], components: [selectRow, navRow] };
}