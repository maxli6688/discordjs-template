/**
 * @file Default Bot Mention Command
 * @author Max.li
 * @since 3.0.0
 */
import config from '../config.js';
const prefix = config.handler.prefix

export default {
  /**
   * @description Executes when the bot is pinged.
   * @author Max.li
   * @param {import('discord.js').Message} message The Message Object of the command.
   */

  async execute (message) {
    return message.channel.send(
      `Hi ${message.author}! My prefix is \`${prefix}\`, get help by \`${prefix}help\``
    );
  },
};
