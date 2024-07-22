import { createRow } from "@magicyan/discord";
import { UserSelectMenuBuilder } from "discord.js";
import { ticketNav } from "./nav.js";

export function ticketAddPanel() {
  const row = createRow(
    new UserSelectMenuBuilder({
      customId: "ticket/control/add",
      placeholder: "Selecione os membros que deseja adicionar",
      minValues: 1,
      maxValues: 25,
    })
  );

  const navRow = createRow(ticketNav.main);

  return { components: [row, navRow] };

}