import { Events } from "discord.js";
import ExtendedClient from "../../class/ExtendedClient.js";

export default {
  event: Events.InteractionCreate,

  /**
   * @description Executes when an interaction is created and handle it.
   * @author Max.li
   * @param {ExtendedClient} client
   * @param {import('discord.js').ContextMenuCommandInteraction} interaction The interaction which was created
   */
  run: async (client, interaction) => {
    if (!interaction.isContextMenuCommand()) return;


    // Checks if the interaction target was a user

    if (interaction.isUserContextMenuCommand()) {
      const command = client.contextCommands.get(
        interaction.commandName
      );

      try {
        return await command.run(client, interaction);
      } catch (err) {
        console.error(err);
        await interaction.reply({
          content: "There was an issue while executing that context command!",
          ephemeral: true,
        });
      }
    }
    // Checks if the interaction target was a message
    else if (interaction.isMessageContextMenuCommand()) {
      const command = client.contextCommands.get(
        interaction.commandName
      );

      try {
        return await command.run(client, interaction);
      } catch (err) {
        console.error(err);
        await interaction.reply({
          content: "There was an issue while executing that context command!",
          ephemeral: true,
        });
      }
    }

    // Practically not possible, but we are still caching the bug.
    // Possible Fix is a restart!
    else {
      return console.log(
        "Something weird happening in context menu. Received a context menu of unknown type."
      );
    }
  },
};
