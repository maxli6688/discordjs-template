import ExtendedClient from "../class/ExtendedClient.js";
import { moduleHandle } from "./loader.js";

/**
 *
 * @param {ExtendedClient} client
 */
const components = async (client) => {
  // collection.components.buttons
  await moduleHandle(client, './src/interactions/buttons/', 'buttonInteractions');
  await moduleHandle(client, './src/interactions/selects/', 'selectInteractions');
  await moduleHandle(client, './src/interactions/modals/', 'modalInteractions');
  await moduleHandle(client, './src/interactions/autocomplete/', 'autocompleteInteractions');

};

export default components;
