/**
 * @file Sample Select-Menu interaction
 * @author Max.li
 * @since 3.0.0
 * @version 3.2.2
 */
import { StringSelectMenuInteraction } from 'discord.js';
import ExtendedClient from '../../../class/ExtendedClient.js';

export default {
  customId: 'example-select',
  /**
   *
   * @param {ExtendedClient} client
   * @param {StringSelectMenuInteraction} interaction
   */
  run: async (client, interaction) => {

    const value = interaction.values[0];

    await interaction.reply({
      content: `You have selected from the menu: **${value}**`,
      ephemeral: true
    });
    return;

  }
};
