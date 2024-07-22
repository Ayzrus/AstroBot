import { icon } from "#functions";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export const ticketNav = {
  main: new ButtonBuilder({
    customId: "ticket/control/back",
    label: "Voltar",
    style: ButtonStyle.Danger,
    emoji: icon("previous")
  }),
  close: new ButtonBuilder({
    customId: "ticket/control/close",
    label: "Fechar",
    style: ButtonStyle.Danger,
    emoji: icon("previous")
  }),
};