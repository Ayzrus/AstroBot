import { Responder, ResponderType } from "#base";
import { db } from "#database";
import { members, verifyModal } from "./verifyRes2.js";

new Responder({
  customId: "verify-code-button",
  type: ResponderType.Button, cache: "cached",
  async run(interaction) {

    if (!interaction.inCachedGuild()) return;

    const { member, guild } = interaction;

    const guildData = await db.guilds.get(guild.id);

    if (guildData?.verify?.role.length === 0) {
      interaction.update({ content: "Não tenho um cargo de verificado configurado. Use /configurações e configure o cargo e tente usar novamente o comando!", embeds: [], components: [] });
      return;
    }

    const role = guild.roles.cache.find(r => r.id === guildData.verify?.role[0]);

    if (!role) return;

    if (member.roles.cache.has(role.id)) {
      interaction.update({ content: "Você já está verificado.", embeds: [], components: [] });
      return;
    }

    if (!members.has(member.id)) {
      interaction.update({ content: "Verifice-se novamente!", embeds: [], components: [] });
      return;
    }

    interaction.showModal(verifyModal);

    const modalInteraction = await interaction.awaitModalSubmit({
      filter: (i) => i.user.id == interaction.user.id,
      time: 0
    });

    if (!modalInteraction) return;

    const { fields } = modalInteraction;

    const codeInput = fields.getTextInputValue("verify-code-input");

    const code = members.get(member.id);

    if (!code || code !== codeInput) {
      modalInteraction.reply({ ephemeral, content: "Codigo expirado ou invalido verifice-se novamente!" });
      return;
    }

    members.delete(member.id);

    await member.roles.add(role);

    modalInteraction.reply({ ephemeral, content: "Você foi verificado com sucesso!" });

    return;

  },
});