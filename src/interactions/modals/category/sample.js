/**
 * @file Sample modal interaction
 * @author Max.li
 * @since 3.2.0
 * @version 3.2.2
 */
import { ModalSubmitInteraction } from 'discord.js';
import ExtendedClient from '../../../class/ExtendedClient.js';

export default {
  id: "sample",

  customId: 'modal-example',
  /**
   *
   * @param {ExtendedClient} client
   * @param {ModalSubmitInteraction} interaction
   */
  run: async (client, interaction) => {

    const nameInput = interaction.fields.getTextInputValue('name');

    await interaction.reply({
      content: `Hey **${nameInput}**, what's up?`
    });
    return;

  }

};
