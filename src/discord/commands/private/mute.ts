import { Command } from "#base";
import { icon, res, sendCommandsLog } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createEmbedAuthor } from "@magicyan/discord";
import { ApplicationCommandType, ApplicationCommandOptionType, ChannelType } from "discord.js";

new Command({
  name: "mute",
  description: "[🔒] Usado para mutar um utilizador.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "Selecione o utilizador",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "tempo",
      description: "Selecione o tempo do mute (em minutos)",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "motivo",
      description: "Selecione o tempo do mute",
      type: ApplicationCommandOptionType.String
    },
  ],
  async run(interaction) {
    const { member, guild, options } = interaction;

    const userOpt = options.getUser("user");

    if (!userOpt) return;

    const user = interaction.guild.members.cache.get(userOpt.id);

    if (!user) return;

    let motivo = interaction.options.getString("motivo");

    if (!motivo) motivo = "Não definido.";

    const tempo = options.getInteger("tempo");

    if (!tempo) return;

    const roleMuted = guild.roles.cache.find(r => r.name === "Astro_Muted");

    if (!roleMuted) {

      try {
        const muteRole = await guild.roles.create({
          name: "Astro_Muted",
          permissions: []
        });

        guild.channels.cache.filter(c => c.type === ChannelType.GuildText).forEach(async (channel) => {
          await channel.permissionOverwrites.edit(muteRole, {
            SendMessages: false,
            AddReactions: false,
          });
        });
      } catch (error) {
        interaction.editReply(res.danger(`${icon("danger")} Não foi possivel criar o cargo do mute ${error}.`));
      }

    }

    const role = guild.roles.cache.find(r => r.name === "Astro_Muted");

    if (!role) return;

    if (user.id === interaction.user.id) return interaction.reply({ ephemeral, content: "Você não pode se mutar a sí mesmo." });

    if (member.roles.cache.has(role.id)) return interaction.reply({ ephemeral, content: "Este usuário já está silenciado!" });

    const embed = createEmbed({
      color: settings.colors.success,
      description: brBuilder(
        `O usuário ${user} (\`${user.id}\`) foi mutado com sucesso!`,
        `Motivo: ${motivo}`,
        `Tempo: ${tempo} ${tempo === 1 ? "minuto" : "minutos"}`
      ),
      author: createEmbedAuthor(interaction.member, { prefix: "Mutado por " }),
    });

    try {
      await user.roles.add(role);
      await interaction.reply({ embeds: [embed] });

      sendCommandsLog({
        color: "warning",
        executor: interaction.member,
        guild: interaction.guild,
        title: "Logs de Mute.",
        text: brBuilder(
          `O usuário ${interaction.member} mutou ${user.displayName}.`,
        )
      });

      setTimeout(async () => {
        if (user.roles.cache.has(role!.id)) {
          await user.roles.remove(role!);
          user.send(`Você foi desmutado no servidor ${guild.name}.`).catch(() => { });
        }
      }, tempo * 60 * 1000);
    } catch (error) {
      return interaction.reply(res.danger(`${icon("danger")} Não foi possível mutar o usuário: ${error}`));
    }

    return;

  }
});