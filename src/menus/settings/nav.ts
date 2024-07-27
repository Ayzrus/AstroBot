import { icon } from "#functions";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export const settingsNav = {
  main: new ButtonBuilder({
    customId: "settings/main",
    label: "Menu Principal",
    style: ButtonStyle.Primary,
    emoji: icon("home")
  }),
  back: (menu: string) => new ButtonBuilder({
    customId: `settings/${menu}`,
    label: "Voltar",
    style: ButtonStyle.Danger,
    emoji: icon("previous")
  })
};