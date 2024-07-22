import { URLStore } from "#base";
import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export function ticketClosePanel(urlStore: URLStore) {

  const embed = createEmbed({
    url: urlStore,
    color: settings.colors.danger,
    description: brBuilder(
      "Encerrar o ticket",
      "Veja as opções abaixo",
      `${icon("transcript")} Transcrever o Ticket`,
      `${icon("trash")} Apagar Ticket`
    )
  });

  const row = createRow(
    new ButtonBuilder({
      customId: "ticket/control/transcript",
      label: "Transcrever",
      emoji: icon("transcript"),
      style: ButtonStyle.Primary
    }),
    new ButtonBuilder({
      customId: "ticket/control/delete",
      label: "Apagar",
      emoji: icon("trash"),
      style: ButtonStyle.Danger
    })
  );

  return { embeds: [embed], components: [row] };

}