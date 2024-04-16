import { UserContextMenuCommandInteraction, ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';
import ExtendedClient from '../../../class/ExtendedClient.js';

export default {
  structure: new ContextMenuCommandBuilder()
    .setName('Test User command')
    .setType(ApplicationCommandType.User),
  /**
   * @param {ExtendedClient} client
   * @param {UserContextMenuCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    await interaction.reply({
      content: 'Hello user context command!'
    });
  }
};
