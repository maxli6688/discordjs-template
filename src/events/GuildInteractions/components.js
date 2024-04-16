import { Events } from 'discord.js';
import config from '../../config.js';
import { log } from '../../functions.js';
import ExtendedClient from '../../class/ExtendedClient.js';
import defaultButtonError from '../../messages/defaultButtonError.js';
import defaultModalError from '../../messages/defaultModalError.js';
import defaultSelectError from '../../messages/defaultSelectError.js';

/*
https://discord.com/developers/docs/interactions/message-components#message-components

Component Types
TYPE	NAME	DESCRIPTION
1	Action Row	Container for other components
2	Button	Button object
3	String Select	Select menu for picking from defined text options
4	Text Input	Text input object
5	User Select	Select menu for users
6	Role Select	Select menu for roles
7	Mentionable Select	Select menu for mentionables (users and roles)
8	Channel Select	Select menu for channels

*/

export default {
  event: Events.InteractionCreate,
  /**
   *
   * @param {ExtendedClient} client
   * @param {import('discord.js').Interaction} interaction
   * @returns
   */
  run: async (client, interaction) => {
    console.log(interaction.customId);
    console.log(interaction.commandName);
    const componentPermission = async (component) => {
      if (component.options?.public === false && interaction.user.id !== interaction.message.interaction.user.id) {
        await interaction.reply({
          content:
            config.messageSettings.notHasPermissionComponent !== undefined &&
              config.messageSettings.notHasPermissionComponent !== null &&
              config.messageSettings.notHasPermissionComponent !== ""
              ? config.messageSettings.notHasPermissionComponent
              : "You do not have permission to use this component",
          ephemeral: true
        });
        return false;
      };

      return true;
    };

    if (interaction.isButton()) {
      const component = client.buttonInteractions.get(interaction.customId);
      if (!component) {
        return await defaultButtonError.execute(interaction);
      };

      if (!(await componentPermission(component))) return;

      try {
        return await component.run(client, interaction);
      } catch (error) {
        log(error, 'error');
        await interaction.reply({
          content: "There was an issue while executing that button!",
          ephemeral: true,
        });
      }

      return;
    };

    // interaction.isStringSelectMenu()
    if (interaction.isAnySelectMenu()) {
      const component = client.selectInteractions.get(interaction.customId);

      if (!component) {
        return await defaultSelectError.execute(interaction);
      }

      if (!(await componentPermission(component))) return;

      try {
        component.run(client, interaction);
      } catch (error) {
        log(error, 'error');
        await interaction.reply({
          content: "There was an issue while executing that select menu option!",
          ephemeral: true,
        });
      }

      return;
    };

    if (interaction.isModalSubmit()) {
      const component = client.modalInteractions.get(interaction.customId);

      if (!component) {
        return await defaultModalError.execute(interaction);
      }

      try {
        component.run(client, interaction);
      } catch (error) {
        log(error, 'error');
        await interaction.reply({
          content: "There was an issue while understanding this modal!",
          ephemeral: true,
        });
      };

      return;
    };

    if (interaction.isAutocomplete()) {
      // autocompleteInteractions.get
      const component = client.autocompleteInteractions.get(interaction.commandName);

      if (!component) return;

      try {
        await component.run(client, interaction);
      } catch (error) {
        log(error, 'error');
        // return Promise.reject(error);
      }

      return;
    };
  }
};
