import { ticketAddPanel } from "./control/add.js";
import { ticketClosePanel } from "./control/close.js";
import { ticketDeletePanel } from "./control/delete.js";
import { ticketControlPanel } from "./control/main.js";
import { ticketRemovePanel } from "./control/remove.js";
import { ticketStaffPanel } from "./control/staff.js";
import { ticketMainPanel } from "./main.js";

export const ticketsMenus = {
  main: ticketMainPanel,
  control: {
    main: ticketControlPanel,
    staff: ticketStaffPanel,
    add: ticketAddPanel,
    remove: ticketRemovePanel,
    close: ticketClosePanel,
    delete: ticketDeletePanel,
  }
};