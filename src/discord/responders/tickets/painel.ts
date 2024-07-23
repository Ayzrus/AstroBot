import { Responder, ResponderType, URLStore } from "#base";
import { db } from "#database";
import { getIncludeRoles, icon, res, sendTicketLog } from "#functions";
import { menus } from "#menus";
import { settings } from "#settings";
import { brBuilder, createEmbed, createEmbedAuthor, createLinkButton, createRow, findChannel, findMember, limitText } from "@magicyan/discord";
import { ActionRowBuilder, ChannelType, ModalBuilder, OverwriteData, PermissionFlagsBits, TextInputBuilder, TextInputStyle, userMention } from "discord.js";

new Responder({
  customId: "ticket/panel/open",
  type: ResponderType.Button, cache: "cached",
  async run(interaction) {

    const { member, guild } = interaction;

    const guildData = await db.guilds.get(guild.id);

    const ticketParentId = guildData.parents?.tickets?.id ?? "";

    const ticketParent = findChannel(guild, ChannelType.GuildCategory).byId(ticketParentId);

    const modal = new ModalBuilder({
      customId: "tickets/control/modalopen",
      title: "Contactar Suporte via Ticket",
    });

    const input1 = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          customId: "ticket/control/input/title",
          label: "Titulo",
          placeholder: "Escreva o titulo da denuncia.",
          style: TextInputStyle.Short,
          required: true,
          minLength: 5,
          maxLength: 15
        }),
      ]
    });

    const input2 = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          customId: "ticket/control/input/description",
          label: "Motivo",
          placeholder: "Escreva o motivo de entrar em contacto com a equipa.",
          style: TextInputStyle.Paragraph,
          required: true
        })
      ]
    });

    modal.setComponents(input1, input2);

    interaction.showModal(modal);

    const modalInteraction = await interaction.awaitModalSubmit({
      filter: (i) => i.user.id == interaction.user.id,
      time: 0
    });

    if (!modalInteraction) return;

    await modalInteraction.reply(res.warning(`${icon(":a:spinner")} Aguarde em quando tratamos do processo...`));

    if (!ticketParent) {
      modalInteraction.editReply(res.danger(`${icon("danger")} Este sistema não foi configurado por favor configure antes de usar!`));
      return;
    }

    const ticketChannel = findChannel(guild).inCategoryId(ticketParentId).byFilter(c => Boolean(c.topic?.includes(member.id)));

    if (ticketChannel) {
      const row = createRow(
        createLinkButton({ url: ticketChannel.url, label: "Ir para o Ticket!" })
      );
      modalInteraction.editReply(res.danger(`${icon("danger")} Você já tem um ticket aberto!`, { components: [row] }));
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

      channel.send(menus.tickets.control.main(member, urlStore, false));

      const { fields } = modalInteraction;

      const title = fields.getTextInputValue("ticket/control/input/title");

      const reason = fields.getTextInputValue("ticket/control/input/description");

      const embedInfo = createEmbed({
        color: settings.colors.azoxo,
        title: "Relato do ticket",
        author: createEmbedAuthor(member, { prefix: "Ticket de " }),
        description: brBuilder(
          `Titulo: ${title}`,
          `Motivo: ${reason}`
        ),
      });

      channel.send({ embeds: [embedInfo] });

      modalInteraction.editReply(res.success(`${icon("sucess")} Seu Ticket foi aberto com sucesso!`, { components: [row] }));

      sendTicketLog({
        color: "success", guild, executor: member,
        text: "Novo ticket aberto."
      });

    }).catch(() => {
      modalInteraction.editReply(res.danger(`${icon("danger")} Não foi possível abrir seu ticket!`));
    });

  },
});