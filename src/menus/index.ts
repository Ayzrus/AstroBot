import { commandMenu } from "./commands/index.js";
import { settingsMenus } from "./settings/index.js";
import { ticketsMenus } from "./tickets/index.js";

export const menus = {
  settings: settingsMenus,
  tickets: ticketsMenus,
  commands: commandMenu
};