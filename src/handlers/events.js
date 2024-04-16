import { readdirSync } from 'fs';
import ExtendedClient from '../class/ExtendedClient.js';
import { moduleHandle } from './loader.js';
/**
 *
 * @param {ExtendedClient} client
 */
const events = async (client) => {
  for (const dir of readdirSync('./src/events/')) {
    // if (dir.endsWith('.js')) {
    //   await moduleEventsHandle(client, '../events/' + dir, 'Events');
    //   continue;
    // };

    // const submodFiles = readdirSync('./src/events/' + dir).filter((f) => f.endsWith('.js'))
    // console.log(submodFiles);
    // for (const file of submodFiles) {
    //   await moduleEventsHandle(client, `../events/${dir}/${file}`, 'Events');
    // };
    await moduleHandle(client, `./src/events/${dir}/`, 'Events');
  };
};

export default events;
