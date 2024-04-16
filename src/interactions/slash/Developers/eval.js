import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  AttachmentBuilder,
} from "discord.js";
import ExtendedClient from "../../../class/ExtendedClient.js";

// global.client = new ExtendedClient();

export default {
  structure: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Execute some codes.")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code to be executed.")
        .setRequired(true)
    ),
  options: {
    ownerOnly: true
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction<true>} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();

    const code = interaction.options.getString("code");

    try {
      let executedEvalValue = eval(code);

      if (typeof executedEvalValue !== 'string') executedEvalValue = require('util').inspect(executedEvalValue);

      executedEvalValue = `${executedEvalValue}` // Making sure it's string

      executedEvalValue = executedEvalValue.replace(new RegExp(client.token, 'gi'), '?');

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Code executed")
            .setDescription(`Successfully executed the code, no errors were found.`)
            .setColor('Green')
        ],
        files: [
          new AttachmentBuilder(Buffer.from(`${executedEvalValue}`.replace(new RegExp(`${client.token}`, 'g'), '"[CLIENT TOKEN HIDDEN]"'), 'utf-8'), { name: 'output.javascript' })
        ]
      });
    } catch (err) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(`Something went wrong while executing your code.`)
            .setColor('Red')
        ],
        files: [
          new AttachmentBuilder(Buffer.from(`${err}`, 'utf-8'), { name: 'output.txt' })
        ]
      });
    };

  },
};
