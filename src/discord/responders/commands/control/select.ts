import { Responder, ResponderType } from "#base";

new Responder({
  customId: "commands/control/:action",
  type: ResponderType.Select, cache: "cached",
  async run(interaction, { action }) {

    // const { member, guild, values } = interaction;

    switch (action) {
      case "unban": {
        console.log("unban");
        return;
      }
    }

  },
});