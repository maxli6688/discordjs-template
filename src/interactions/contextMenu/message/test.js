import { MessageContextMenuCommandInteraction, ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';
import ExtendedClient from '../../../class/ExtendedClient.js';

const test = {
  structure: new ContextMenuCommandBuilder()
    .setName('Test Message command')
    .setType(ApplicationCommandType.Message),
  /**
   * @param {ExtendedClient} client
   * @param {MessageContextMenuCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    await interaction.reply({
      content: 'Hello message context command!'
    });

  }
};

export default test;
