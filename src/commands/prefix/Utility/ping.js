import { Message } from 'discord.js';
import ExtendedClient from '../../../class/ExtendedClient.js';

export default {
  structure: {
    name: 'ping',
    description: 'Replies with Pong!',
    aliases: ['p'],
    permissions: 'Administrator',
    cooldown: 5000
  },
  /**
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    // message.channel.send({ content: "Pong." });
    await message.reply({
      content: 'Pong! ' + client.ws.ping
    });

  }
};
