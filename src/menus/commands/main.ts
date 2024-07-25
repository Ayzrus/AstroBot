import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, Guild } from "discord.js";

export function commandMainPanel(guild: Guild) {
  const embed = createEmbed({
    color: settings.colors.azoxo,
    description: brBuilder(
      "Sistema de Unban",
      "Se você precisa desbanir alguem use este menu.",
    ),
    footer: {
      text: guild.name,
      iconURL: guild.iconURL()
    }
  });

  const row = createRow(
    new ButtonBuilder({
      customId: "commands/panel/open",
      label: "Unban.",
      emoji: "⚒️",
      style: ButtonStyle.Success
    })
  );

  return { embeds: [embed], components: [row] };

}