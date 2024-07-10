import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export function settingsMainMenu() {

  const embed = createEmbed({
    color: settings.colors.primary,
    description: brBuilder(
      `# ${icon("gear")} Painel de Configurações`,
      "- 📖 Definir canais",
      "- 📑 Definir categorias",
      "- 📗 Definir roles de Tickets",
    )
  });

  const row = createRow(
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
    })
  );

  return { ephemeral, embeds: [embed], components: [row] };
}