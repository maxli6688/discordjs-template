import { REST, Routes } from "discord.js";
import { log, isSnowflake } from "../functions.js";
import config from "../config.js";
import ExtendedClient from "../class/ExtendedClient.js";

/**
 * Registration of Slash-Commands in Discord API
 * @param {ExtendedClient} client
 */
const deploy = async (client) => {
  const rest = new REST({ version: "10" }).setToken(config.client.token);
  try {
    log("Started loading application commands... (this might take minutes!)", "info");
    // console.log('Started refreshing application (/) commands.');
    // console.log('Successfully reloaded application (/) commands.');

    // const commandJsonData = client.applicationcommandsArray
    const commandJsonData = [
      ...Array.from(client.slashCommands.values()).map((c) => c.structure.toJSON()),
      ...Array.from(client.contextCommands.values()).map((c) => c.structure.toJSON()),
    ];
    // console.log(commandJsonData);
    const guildId = config.development.guild;

    if (config.development && config.development.enabled && guildId) {
      if (!isSnowflake(guildId)) {
        log("Guild ID is missing. Please set it in .env or config file or disable development in the config", "err");
        return;
      };

      await rest.put(
        Routes.applicationGuildCommands(config.client.id, guildId), {
        body: commandJsonData,
      }
      );

      log(`Successfully loaded application commands to guild ${guildId}.`, "done");
    } else {

      await rest.put(
        /**
         * By default, you will be using guild commands during development.
         * Once you are done and ready to use global commands (which have 1 hour cache time),
         * 1. Please uncomment the below (commented) line to deploy global commands.
         * 2. Please comment the below (uncommented) line (for guild commands).
         */
        // Routes.applicationGuildCommands(client_id, test_guild_id),

        /**
         * Good advice for global commands, you need to execute them only once to update
         * your commands to the Discord API. Please comment it again after running the bot once
         * to ensure they don't get re-deployed on the next restart.
         */

        // Routes.applicationCommands(client_id)

        Routes.applicationCommands(config.client.id), {
        body: commandJsonData,
      }
      );

      log("Successfully loaded application commands globally to Discord API.", "done");
    }
  } catch (e) {
    log(`Unable to load application commands to Discord API: ${e.message}`, "err");
  }
};

export default deploy;
