import { Responder, ResponderType } from "#base";
import { createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from "discord.js";

new Responder({
  customId: "commands/panel/open",
  type: ResponderType.Button, cache: "cached",
  async run(interaction) {

    const { guild } = interaction;

    const bans = await guild.bans.fetch();
    if (bans.size === 0) {
      return interaction.reply({ content: "Não há usuários banidos.", ephemeral: true });
    }

    const options = bans.map(ban => ({
      label: ban.user.tag,
      description: "Motivo de banimento: " + ban.reason || "Não definido",
      value: ban.user.id,
    }));

    const row = createRow(
      new StringSelectMenuBuilder({
        customId: "commands/users/select",
        placeholder: "Selecione o utilizador para desbanir",
        options: Array.from(options)
      })
    );

    const attRow = createRow(
      new ButtonBuilder({
        customId: "commands/panel/open",
        label: "Atualizar lista",
        emoji: "⚒️",
        style: ButtonStyle.Success
      })
    );

    interaction.update({ components: [row, attRow] });

    return;

  },
});