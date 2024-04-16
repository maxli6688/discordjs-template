import { Events } from 'discord.js';
import { log } from '../../functions.js';
import ExtendedClient from '../../class/ExtendedClient.js';

export default {
  event: Events.ClientReady,
  once: true,
  /**
   * @description Executes when client is ready (bot initialization).
   * @param {ExtendedClient} _
   * @param {import('discord.js').Client<true>} client Main Application Client.
   * @returns
   */
  run: (_, client) => {

    log('Logged in as: ' + client.user.tag, 'done');

  }
};

