import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import ExtendedClient from '../../../class/ExtendedClient.js';

export default {
  structure: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),
  options: {
    cooldown: 5000
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    await interaction.reply({
      content: 'Pong! ' + client.ws.ping
    });

  }
};
