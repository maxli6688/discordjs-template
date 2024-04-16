import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } from 'discord.js';
import ExtendedClient from '../../../class/ExtendedClient.js';

export default {
  structure: new SlashCommandBuilder()
    .setName('components')
    .setDescription('Test the components handler.'),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    await interaction.reply({
      content: 'Select one of the components below.',
      components: [
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('example-button')
              .setLabel('Example Button')
              .setStyle(1)
          ),
        new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('example-select')
              .setPlaceholder('Example Select menu')
              .addOptions(
                { label: 'Option 1', value: 'option 1' },
                { label: 'Option 2', value: 'option 2' },
                { label: 'Option 3', value: 'option 3' },
              )
          )
      ]
    });

  }
};
