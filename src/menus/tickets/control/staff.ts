import { URLStore } from "#base";
import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { StringSelectMenuBuilder } from "discord.js";

export function ticketStaffPanel(urlStore: URLStore) {

  const embed = createEmbed({
    url: urlStore,
    color: settings.colors.azoxo,
    description: brBuilder(
      `${icon("staff")} Painel Staff`,
      "Veja as opções abaixo:",
    )
  });

  const row = createRow(
    new StringSelectMenuBuilder({
      customId: "ticket/control/staff",
      placeholder: "Selecione o que deseja fazer",
      options: [
        {
          label: "Notificar",
          value: "notify",
          emoji: icon("bell"),
          description: "Notificar o membro."
        },
        {
          label: "Adicionar Membros",
          value: "add",
          emoji: icon("add"),
          description: "Adicionar membros ao ticket."
        },
        {
          label: "Remover Membros",
          value: "remove",
          emoji: icon("minus"),
          description: "Remover membros do ticket."
        },
      ]
    })
  );

  return { ephemeral, embeds: [embed], components: [row] };

}