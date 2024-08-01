import { Responder, ResponderType } from "#base";
import { db } from "#database";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, italic, ModalBuilder, TextInputBuilder, TextInputStyle, time } from "discord.js";

export const members: Collection<string, string> = new Collection();

export const verifyModal = new ModalBuilder({
  customId: "verify-code-modal",
  title: "Verificação",
  components: [
    new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          customId: "verify-code-input",
          label: "Código de Verificação",
          placeholder: "Insira o código de verificação.",
          style: TextInputStyle.Short,
          required: true,
        }),
      ]
    })
  ]
});

new Responder({
  customId: "verify-code-form",
  type: ResponderType.Button, cache: "cached",
  async run(interaction) {

    if (!interaction.inCachedGuild()) return;

    const { member, guild } = interaction;

    const guildData = await db.guilds.get(guild.id);

    if (guildData?.verify?.role.length === 0) {
      interaction.reply({ ephemeral: true, content: "Não tenho um cargo de verificado configurado. Use /configurações e configure o cargo e tente usar novamente o comando!" });
      return;
    }

    const role = guild.roles.cache.find(r => r.id === guildData.verify?.role[0]);

    if (!role) return;

    if (member.roles.cache.has(role.id)) {
      interaction.reply({ ephemeral: true, content: "Você já está verificado." });
      return;
    }

    if (members.has(member.id)) {
      interaction.showModal(verifyModal);
      return;
    }

    const code = randomText();

    const timestamp = new Date(Date.now() + 60000);

    await interaction.reply({
      ephemeral,
      embeds: [
        createEmbed({
          title: "Sistema de verificação",
          description: brBuilder(
            `Você precisará digitar o código a seguir: ||${code}||`,
            "Copie o codigo e cole no formulário que sera exibido.",
            `${italic(`O código expira em: ${time(timestamp, "R")}`)}`,
            "Clique no botão para verificar."
          )
        })
      ],
      components: [
        createRow(
          new ButtonBuilder(
            {
              customId: "verify-code-button",
              label: "Verificar",
              style: ButtonStyle.Success
            })
        )
      ]
    });

    members.set(member.id, code);

    setTimeout(() => members.delete(member.id), 60_000);

    return;

  },
});

function alternateCapitals(str: string) {
  return [...str].map((char, i) => char[`to${i % 2 ? "Upper" : "Lower"}Case`]()).join("");
}

function randomText() {
  return alternateCapitals(Math.random().toString(36).substring(2, 8));
}