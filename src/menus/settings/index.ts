import { settingsChannelMenu, settingsChannelsMenu } from "./channels.js";
import { settingsMainMenu } from "./main.js";
import { settingsParentMenu, settingsParentsMenu } from "./parents.js";
import { settingsRolesAddMenu, settingsRolesMenu, settingsRolesRemoveMenu } from "./roles.js";
import { settingsRolesLevelsAddMenu, settingsRolesLevelsMenu, settingsRolesLevelsMultiplierMenu, settingsRolesLevelsRemoveMenu } from "./rolesLevels.js";

export const settingsMenus = {
  main: settingsMainMenu,
  channels: {
    main: settingsChannelsMenu,
    submenu: settingsChannelMenu
  },
  parents: {
    main: settingsParentsMenu,
    submenu: settingsParentMenu
  },
  roles: {
    main: settingsRolesMenu,
    add: settingsRolesAddMenu,
    remove: settingsRolesRemoveMenu
  },
  levels: {
    main: settingsRolesLevelsMenu,
    add: settingsRolesLevelsAddMenu,
    remove: settingsRolesLevelsRemoveMenu,
    multiplier: settingsRolesLevelsMultiplierMenu
  }
};