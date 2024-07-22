import { URLStore } from "#base";
import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createEmbedAuthor, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, GuildMember } from "discord.js";

export function ticketControlPanel(member: GuildMember, urlStore: URLStore) {

  const embed = createEmbed({
    url: urlStore,
    color: settings.colors.green,
    author: createEmbedAuthor(member, { prefix: "Ticket de " }),
    thumbnail: member.displayAvatarURL(),
    description: brBuilder(
      `Este é o seu ticket  ${member}`,
      "Para a equipa saber o que se passa, envie detalhes",
      "sobre o assunto do ticket e em breve",
      "a nossa equipa irá respondê-lo(a)"
    )
  });

  const row = createRow(
    new ButtonBuilder({
      customId: "ticket/control/staff",
      label: "Painel Staff",
      emoji: icon("staff"),
      style: ButtonStyle.Primary
    }),
    new ButtonBuilder({
      customId: "ticket/control/close",
      label: "Fechar Ticket",
      emoji: icon("close"),
      style: ButtonStyle.Danger
    })
  );

  return { embeds: [embed], components: [row] };

}