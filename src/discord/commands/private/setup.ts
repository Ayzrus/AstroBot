import { Command } from "#base";
import { icon, res } from "#functions";
import { menus } from "#menus";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, codeBlock, Guild } from "discord.js";

new Command({
  name: "setup",
  description: "Comando de setup do painel de Ticket.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "tickets",
      description: "Faz o setup do sistema de tickets.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "canal",
          description: "Selecione o canal onde o painel vai ser inserido.",
          type: ApplicationCommandOptionType.Channel,
          channelTypes: [ChannelType.GuildText],
          required
        }
      ]
    }
  ],
  async run(interaction) {
    const { options, guild } = interaction;

    switch (options.getSubcommand(true)) {
      case "tickets":
        await interaction.deferReply({ ephemeral });

        const channel = options.getChannel("canal", true, [ChannelType.GuildText]);

        channel.send(menus.tickets.main(guild))
          .then(message => {
            interaction.editReply(res.success(`${icon("sucess")} O painel foi enviado com sucesso ${message.url}.`));
          }).catch(error => {
            interaction.editReply(res.danger(`${icon("danger")} Não foi possivel enviar o painel com sucesso ${codeBlock(error)}.`));
          });
        return;
    }

  }
});