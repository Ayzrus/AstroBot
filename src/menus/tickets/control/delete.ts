import { createEmbed, createRow } from "@magicyan/discord";
import { ticketNav } from "./nav.js";
import { ButtonBuilder, ButtonStyle } from "discord.js";
import { settings } from "#settings";
import { icon } from "#functions";

export function ticketDeletePanel() {

  const embed = createEmbed({
    color: settings.colors.warning,
    description: "Tem certeza que deseja apagar este ticket?"
  });

  const row = createRow(
    new ButtonBuilder({
      customId: "ticket/control/trashbin",
      label: "Confirmar",
      emoji: icon("trash"),
      style: ButtonStyle.Danger
    })
  );

  const navRow = createRow(ticketNav.close);

  return { ephemeral, embeds: [embed], components: [row, navRow] };

}