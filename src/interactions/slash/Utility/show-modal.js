import { ChatInputCommandInteraction, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import ExtendedClient from '../../../class/ExtendedClient.js';

export default {
  structure: new SlashCommandBuilder()
    .setName('show-modal')
    .setDescription('Modal interaction testing.'),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    console.log(3333333);
    const modal = new ModalBuilder()
      .setTitle('Modal Example')
      .setCustomId('modal-example')
      .addComponents(
        new ActionRowBuilder()
          .addComponents(
            new TextInputBuilder()
              .setLabel('What\'s your name?')
              .setCustomId('name')
              .setPlaceholder('Type your name here!')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          )
      );

    await interaction.showModal(modal);

  }
};
