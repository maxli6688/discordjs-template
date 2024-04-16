/**
 * @file Sample button interaction
 * @author Max.li
 * @version 3.2.2
 */
import { ButtonInteraction } from 'discord.js';
import ExtendedClient from '../../../class/ExtendedClient.js';

export default {
  customId: 'example-button',

  /**
   *
   * @param {ExtendedClient} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client, interaction) => {

    await interaction.reply({
      content: 'The button has been successfully responded!',
      ephemeral: true
    });
    // return;
  }
};

