import { Responder, ResponderType, URLStore } from "#base";
import { icon, res, sendTicketLog } from "#functions";
import { menus } from "#menus";
import { settings } from "#settings";
import { brBuilder, createEmbed, createLinkButton, createRow, findMember } from "@magicyan/discord";
import { TextChannel } from "discord.js";

new Responder({
  customId: "ticket/control/:action",
  type: ResponderType.Select, cache: "cached",
  async run(interaction, { action }) {

    const { member, guild, values } = interaction;

    const channel = interaction.channel as TextChannel;

    const embed = createEmbed({ from: interaction });

    const urlStore = new URLStore(embed.data.url);

    const ticketOwner = findMember(guild).byId(urlStore.record.ownerId!);

    const [selected] = values;

    switch (action) {
      case "staff": {
        switch (selected) {
          case "notify": {

            await interaction.update({});
            if (!ticketOwner) {
              interaction.followUp(res.danger(`${icon("danger")} O dono do ticket não se encontra mais no servidor!`));
              return;
            }

            const embed = createEmbed({
              color: settings.colors.warning,
              thumbnail: guild.iconURL(),
              description: brBuilder(
                "Você esta sendo chamado ao seu ticket!",
                `${member} está sendo chamado no seu ticket em ${channel.url}`
              ),
              footer: { text: guild.name, iconURL: guild.iconURL() }
            });

            const row = createRow(
              createLinkButton({ url: channel.url, label: "Ir para o Ticket!" })
            );

            ticketOwner.send({ embeds: [embed], components: [row] }).then(() => {
              interaction.followUp(res.success(`${icon("sucess")} O dono do ticket foi notificado com sucesso!`));
              sendTicketLog({
                color: "warning",
                guild,
                executor: member,
                text: `Notificou o dono do Ticket ${channel.name}`
              });
            }).catch(() => {
              interaction.followUp(res.danger(`${icon("danger")} Não foi possível notificar o membro!`));
              sendTicketLog({
                color: "warning",
                guild,
                executor: member,
                text: `Não foi possível notificar o membro do ticket ${channel.name}`
              });
            });

            return;
          }
          case "add": {
            interaction.update(menus.tickets.control.add());
            return;
          }
          case "remove": {
            const members = guild.members.cache.filter(m => channel.permissionOverwrites.cache.has(m.id));
            members.delete(urlStore.record.ownerId!);
            if (members.size < 1) {
              await interaction.update({});
              interaction.followUp(res.danger(`${icon("danger")} Não há membros para serem removidos deste canal!`));
              return;
            }
            interaction.update(menus.tickets.control.remove(members));
            return;
          }
        }
        return;
      }
      case "add": {
        const addedMembers = [];
        for (const userId of values) {
          channel.permissionOverwrites.create(userId, { ViewChannel: true });
          addedMembers.push(`<@${userId}>`);
        }

        await interaction.update(menus.tickets.control.staff(urlStore));

        interaction.followUp(res.success(`${icon("sucess")} Membros adicionados ao ticket com sucesso!`));

        const addedMembersText = addedMembers.join(", ");

        sendTicketLog({
          color: "warning",
          guild,
          executor: member,
          text: `Membros adicionados ao ticket ${channel.name}: ${addedMembersText}`
        });
        return;
      }
      case "remove": {

        const addedMembers = [];
        for (const userId of values) {
          channel.permissionOverwrites.delete(userId);
          addedMembers.push(`<@${userId}>`);
        }

        await interaction.update(menus.tickets.control.staff(urlStore));

        interaction.followUp(res.success(`${icon("sucess")} Membros removidos do ticket com sucesso!`));

        const addedMembersText = addedMembers.join(", ");

        sendTicketLog({
          color: "warning",
          guild,
          executor: member,
          text: `Membros removidos do ticket ${channel.name}: ${addedMembersText}`
        });

        return;

      }
    }

  },
});