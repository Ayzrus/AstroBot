import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export function settingsMainMenu(antiflood: boolean) {

  const embed = createEmbed({
    color: settings.colors.primary,
    description: brBuilder(
      `# ${icon("gear")} Painel de Configurações`,
      "- 📖 Definir canais",
      "- 📑 Definir categorias",
      "- 📗 Definir roles de Tickets",
      "- 🆙 Definir roles do Sistema de Level",
      "- 🚫 Sistema anti-flood",
    )
  });

  const createAntiFloodRow = (isAntiFlood: boolean) => {
    return createRow(
      new ButtonBuilder({
        customId: "settings/anti",
        label: "Sistema anti-flood",
        emoji: isAntiFlood ? "✅" : "🚫",
        style: isAntiFlood ? ButtonStyle.Success : ButtonStyle.Danger
      }),
      new ButtonBuilder({
        customId: "settings/verify",
        label: "Cargo do Verificar",
        emoji: "📗",
        style: ButtonStyle.Secondary
      }),
    );
  };

  const mainRow = createRow(
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
  );

  const secRow = createAntiFloodRow(antiflood);

  return { ephemeral, embeds: [embed], components: [mainRow, secRow] };
}