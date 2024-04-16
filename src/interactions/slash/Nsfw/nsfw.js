import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import ExtendedClient from "../../../class/ExtendedClient.js";

export default {
  structure: new SlashCommandBuilder()
    .setName("nsfw")
    .setDescription("Nsfw command."),
  options: {
    nsfw: true,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    await interaction.reply({ content: "NSFW Command!" });

  }
};
