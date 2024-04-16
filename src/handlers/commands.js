
import ExtendedClient from '../class/ExtendedClient.js';
import { moduleHandle } from './loader.js';

/**
 *
 * @param {ExtendedClient} client
 */
const commands = async (client) => {
  await moduleHandle(client, './src/commands/prefix/', 'prefixCommands');
  await moduleHandle(client, './src/interactions/slash/', 'slashCommands');
  await moduleHandle(client, './src/interactions/contextMenu/', 'contextCommands');
};

export default commands;
