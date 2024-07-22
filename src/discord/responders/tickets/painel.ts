import { Responder, ResponderType, URLStore } from "#base";
import { db } from "#database";
import { getIncludeRoles, icon, res, sendTicketLog } from "#functions";
import { menus } from "#menus";
import { createLinkButton, createRow, findChannel, limitText } from "@magicyan/discord";
import { ChannelType, OverwriteData, PermissionFlagsBits } from "discord.js";

new Responder({
  customId: "ticket/panel/open",
  type: ResponderType.Button, cache: "cached",
  async run(interaction) {

    const { client, member, guild } = interaction;

    const guildData = await db.guilds.get(guild.id);

    const ticketParentId = guildData.parents?.tickets?.id ?? "";

    const ticketParent = findChannel(guild, ChannelType.GuildCategory).byId(ticketParentId);

    await interaction.reply(res.warning(`${icon(":a:spinner")} Aguarde em quando tratamos do processo...`));

    if (!ticketParent) {
      interaction.editReply(res.danger(`${icon("danger")} Este sistema não foi configurado por favor configure antes de usar!`));
      return;
    }

    const ticketChannel = findChannel(guild).inCategoryId(ticketParentId).byFilter(c => Boolean(c.topic?.includes(member.id)));

    if (ticketChannel) {
      const row = createRow(
        createLinkButton({ url: ticketChannel.url, label: "Ir para o Ticket!" })
      );
      interaction.editReply(res.danger(`${icon("danger")} Você já tem um ticket aberto!`, { components: [row] }));
      return;
    }

    const roles = getIncludeRoles(guildData.tickets?.roles, guild);

    const perms: OverwriteData[] = roles.map(role => ({
      id: role.id, allow: [PermissionFlagsBits.ViewChannel]
    }));

    perms.push(
      { id: guild.id, deny: [PermissionFlagsBits.ViewChannel], allow: [PermissionFlagsBits.SendMessages] },
      { id: member.id, allow: [PermissionFlagsBits.ViewChannel] }
    );

    guild.channels.create({
      name: `${limitText(member.user.username, 18)}-ticket`,
      parent: ticketParent,
      permissionOverwrites: perms,
      topic: member.id,
      type: ChannelType.GuildText
    }).then(channel => {
      const row = createRow(
        createLinkButton({ url: channel.url, label: "Acessar o Ticket!" })
      );

      const urlStore = new URLStore();

      urlStore.set("ownerId", member.id);
      urlStore.set("ownerUsername", member.user.username);
      urlStore.set("createdAt", new Date().toString());

      channel.send(menus.tickets.control.main(member, urlStore));

      interaction.editReply(res.success(`${icon("sucess")} Seu Ticket foi aberto com sucesso!`, { components: [row] }));

      sendTicketLog({
        color: "success", guild, executor: member,
        text: "Novo ticket aberto."
      });

    }).catch(() => {
      interaction.editReply(res.danger(`${icon("danger")} Não foi possível abrir seu ticket!`));
    });

  },
});