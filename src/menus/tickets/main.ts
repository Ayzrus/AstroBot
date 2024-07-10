import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, Guild } from "discord.js";

export function ticketMainPanel(guild: Guild) {
  const embed = createEmbed({
    color: settings.colors.azoxo,
    description: brBuilder(
      "Sistema de Ticket",
      "Se você precisa de suporte clique abaixo para abrir um ticket!",
      "",
      "Após isso forneça as informações para agilizar",
      "o atendimento! Então basta aguardar que nossa equipa",
      "irá entrar em contacto no seu ticket!"
    ),
    footer: {
      text: guild.name,
      iconURL: guild.iconURL()
    }
  });

  const row = createRow(
    new ButtonBuilder({
      customId: "ticket/panel/open",
      label: "Abrir Ticket.",
      emoji: "🎟️",
      style: ButtonStyle.Success
    })
  );

  return { embeds: [embed], components: [row] };

}