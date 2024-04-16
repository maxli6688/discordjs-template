import { readdirSync } from 'fs';
import ExtendedClient from '../class/ExtendedClient.js';
import { moduleHandle } from './loader.js';
/**
 * Registration of Message Based Chat Triggers
 * @param {ExtendedClient} client
 */
const events = async (client) => {
  for (const dir of readdirSync('./src/triggers/')) {
    await moduleHandle(client, `./src/triggers/${dir}/`, 'Triggers');
  };
};

export default events;
