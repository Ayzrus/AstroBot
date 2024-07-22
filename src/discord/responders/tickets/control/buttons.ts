import { Responder, ResponderType, URLStore } from "#base";
import { db } from "#database";
import { getIncludeRoles, icon, res, sendTicketLog } from "#functions";
import { menus } from "#menus";
import { settings } from "#settings";
import { brBuilder, createEmbed, findChannel, findMember, sleep, toNull } from "@magicyan/discord";
import { createTranscript, ExportReturnType } from "discord-html-transcripts";
import { codeBlock, OverwriteType, TextChannel, time, userMention } from "discord.js";

new Responder({
  customId: "ticket/control/:action",
  type: ResponderType.Button, cache: "cached",
  async run(interaction, { action }) {

    const { member, guild } = interaction;

    const channel = interaction.channel as TextChannel;

    const embed = createEmbed({ from: interaction });

    const urlStore = new URLStore(embed.data.url);

    const ticketOwner = findMember(guild).byId(urlStore.record.ownerId!);

    const guildData = await db.guilds.get(guild.id);

    const allowedRoles = getIncludeRoles(guildData.tickets?.roles, guild);

    if (!member.roles.cache.some(r => allowedRoles.has(r.id))) {

      interaction.reply(res.danger(`${icon("danger")} Você não tem permissão para fazer isso!`));

      return;
    }

    switch (action) {
      case "staff": {
        interaction.reply(menus.tickets.control.staff(urlStore));
        return;
      }
      case "back": {
        interaction.update(menus.tickets.control.staff(urlStore));
        return;
      }
      case "close": {
        const ticketState = guildData.get("tickets.closed");

        if (ticketState[0] === channel.id && ticketState[1]) {
          interaction.update(menus.tickets.control.close(urlStore));

          const perms = channel.permissionOverwrites.cache.filter(perm => perm.type !== OverwriteType.Member);

          channel.permissionOverwrites.set(perms);
        } else {
          interaction.update(menus.tickets.control.close(urlStore));

          const perms = channel.permissionOverwrites.cache.filter(perm => perm.type !== OverwriteType.Member);

          channel.permissionOverwrites.set(perms);

          const embed = createEmbed({
            color: settings.colors.warning,
            thumbnail: guild.iconURL(),
            description: brBuilder(
              "Caro membro da nossa comunidade",
              `Seu ticket foi fechado as ${new Date().toLocaleTimeString()} `,
              `por ${member}`,
              `${channel.url}`
            ),
            footer: { text: guild.name, iconURL: guild.iconURL() }
          });

          ticketOwner?.send({ embeds: [embed] });

          sendTicketLog({
            color: "danger",
            guild,
            executor: member,
            text: `Ticket ${channel.name} foi fechado.`
          });

          guildData.$set("tickets.closed", [channel.id, true]);
          await guildData.save();
        }
        return;
      }
      case "transcript": {

        const transcriptChannelId = guildData.channels?.transcripts?.id ?? "";

        const transcriptChannel = findChannel(guild).byId(transcriptChannelId);

        if (!transcriptChannel) {
          interaction.reply(res.danger(`${icon("danger")} O canal de transcripts não está configurado!`));
          return;
        }
        await interaction.reply(res.warning(`${icon(":a:spinner")} Transcrevendo o ticket! Aguarde...`));

        const attachment = await createTranscript(channel as never, {
          limit: -1,
          poweredBy: false,
          filename: "ticket-transcript.html",
          returnType: ExportReturnType.Attachment,
          saveImages: true
        });

        const createdAt = new Date(urlStore.record.createdAt!);

        const transcriptAt = new Date();

        const embed = createEmbed({
          color: settings.colors.primary,
          description: brBuilder(
            `Ticket de ${ticketOwner ?? "Desconhecido"} **@${urlStore.record.ownerUsername}**`,
            `Criado em ${time(createdAt, "F")}`,
            `Transcrito em ${time(transcriptAt, "F")}`
          )
        });

        transcriptChannel.send({ embeds: [embed], files: [attachment] })
          .then(message => {
            interaction.editReply(res.success(`${icon("sucess")} Ticket transcrito com sucesso! ${message.url}`));

            sendTicketLog({
              color: "warning",
              guild,
              executor: member,
              text: `Ticket transcrito ${channel.name}`
            });

          }).catch(err => {
            interaction.editReply(res.danger(`${icon("danger")} Não foi possível transcrever o ticket ${codeBlock(err)}!`));

            sendTicketLog({
              color: "warning",
              guild,
              executor: member,
              text: `Erro ao transcrever o ticket ${channel.name}! ${codeBlock(err)}`
            });
          });

        return;
      }
      case "delete": {
        interaction.update(menus.tickets.control.delete());
        return;
      }
      case "trashbin": {
        await interaction.update(res.danger(`${icon(":a:spinner")} Este ticket sera deletado em breve momento! Aguarde...`, { components: [] }));
        await sleep(4000);
        channel.delete().catch(toNull);

        sendTicketLog({
          color: "danger",
          guild,
          executor: member,
          text: `**Ticket de ${userMention(channel.topic ?? "")} foi deletado**`
        });

      }
    }

  },
});