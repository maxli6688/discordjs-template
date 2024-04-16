import { SlashCommandBuilder } from 'discord.js';
import ExtendedClient from '../../../class/ExtendedClient.js';

export default {
  structure: new SlashCommandBuilder()
    .setName('autocomplete')
    .setDescription('An example of the autocomplete system')
    .addStringOption(option =>
      option.setName('fruit')
        .setDescription('Choose a fruit')
        .setAutocomplete(true)
        .setRequired(true)
    ),
  options: {
    public: true
  },
  /**
   *
   * @param {ExtendedClient} client
   * @param {import('discord.js').CommandInteraction} interaction
   */
  run: async (client, interaction) => {

    const chosenFruit = interaction.options.getString('fruit');

    await interaction.reply({
      content: `You chose the fruit: **${chosenFruit}**`
    });

  }
};
