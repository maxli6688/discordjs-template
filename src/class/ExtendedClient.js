/**
 * @file Main File of the bot, responsible for registering events, commands, interactions etc.
 * @author Max.li
 * @since 1.0.0
 * @version 3.3.0
 */

import { Client, Collection, Partials, GatewayIntentBits } from 'discord.js';
import config from '../config.js';
import commands from '../handlers/commands.js';
import events from '../handlers/events.js';
import deploy from '../handlers/deploy.js';
import components from '../handlers/components.js';
import mongoose from '../handlers/mongoose.js';


class ExtendedClient extends Client {
  collection = {
    /**
     * @deprecated Use client.prefixcommands
     */
    prefixcommands: new Collection(),
    aliases: new Collection(),
    /**
     * @deprecated Use client.slashCommands
     */
    interactioncommands: new Collection(),
    /**
     * @deprecated Use client.*Interactions
     */
    components: {
      buttons: new Collection(),
      selects: new Collection(),
      modals: new Collection(),
      autocomplete: new Collection()
    }
  };
  // prefixcommands
  prefixCommands = new Collection(); // src/commands/prefix

  // interactioncommands
  slashCommands = new Collection(); // src/interactions/slash
  contextCommands = new Collection(); // src/interactions/contextMenu

  // components
  buttonInteractions = new Collection(); // src/interactions/buttons
  selectInteractions = new Collection(); // src/interactions/selectMenus
  modalInteractions = new Collection(); // src/interactions/modals
  autocompleteInteractions = new Collection(); // src/interactions/autocomplete

  cooldowns = new Collection();
  triggers = new Collection(); // src/triggers

  applicationcommandsArray = [];

  constructor() {
    super({
      // Please add all intents you need, more detailed information @ https://ziad87.net/intents/
      // intents: 3276799, // Every intent
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        // GatewayIntentBits.MessageCreate,
        // Intents.FLAGS.Guilds, //adds server functionality
        // Intents.FLAGS.GuildMessages, //gets messages from our bot.
      ],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
        Partials.ThreadMember
      ],
      presence: {
        activities: [{
          name: 'something goes here',
          type: 4,
          state: 'DiscordJS-V14-Bot-Template' // This is the status message
        }]
      }
    });
  };

  start = async () => {
    await events(this);
    await commands(this);
    await components(this);

    // register commands
    if (config.handler.deploy) deploy(this, config);

    if (config.handler.mongodb.enabled) mongoose();

    // this.on('messageCreate', (message) => {
    //   console.log('Un Mensaje! :D');
    //   console.log(message);
    // })
    // this.on('interactionCreate', interaction => {
    //   console.log(interaction);
    // })

    await this.login(config.client.token);

  };
};

export default ExtendedClient;
