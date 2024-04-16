import { Events, BaseInteraction } from "discord.js";
import config from "../../config.js";
import { log } from "../../functions.js";
import ExtendedClient from "../../class/ExtendedClient.js";

const cooldown = new Map();

/*
CommandInteraction
CollectedInteraction

class BaseInteraction
type Interaction
| ChatInputCommandInteraction<Cached>

| MessageContextMenuCommandInteraction<Cached>
| UserContextMenuCommandInteraction<Cached>

| AnySelectMenuInteraction<Cached>
| ButtonInteraction<Cached>
| AutocompleteInteraction<Cached>
| ModalSubmitInteraction<Cached>;
*/

export default {
  event: Events.InteractionCreate,

  /**
   * @description Executes when an interaction is created and handle it.
   * @author Max.li
   * @param {ExtendedClient} client
   * @param {BaseInteraction} interaction The interaction which was created
   */
  run: async (client, interaction) => {
    if (interaction.isContextMenuCommand()) return;

    if (!interaction.isCommand()) return;

    if (!interaction.isChatInputCommand()) return;

    // config handler commands settings
    if (!config.handler.commands.slash && interaction.isChatInputCommand()) return;

    if (!config.handler.commands.user && interaction.isUserContextMenuCommand()) return;

    if (!config.handler.commands.message && interaction.isMessageContextMenuCommand()) return;

    const command = client.slashCommands.get(
      interaction.commandName
    );

    if (!command) return;

    try {
      if (command.options?.ownerOnly) {
        if (interaction.user.id !== config.users.ownerId) {
          await interaction.reply({
            content:
              config.messageSettings.ownerMessage !== undefined &&
                config.messageSettings.ownerMessage !== null &&
                config.messageSettings.ownerMessage !== ""
                ? config.messageSettings.ownerMessage
                : "The bot developer has the only permissions to use this command.",
            ephemeral: true
          });

          return;
        }
      }

      if (command.options?.developers) {
        if (
          config.users?.developers?.length > 0 &&
          !config.users?.developers?.includes(interaction.user.id)
        ) {
          await interaction.reply({
            content:
              config.messageSettings.developerMessage !== undefined &&
                config.messageSettings.developerMessage !== null &&
                config.messageSettings.developerMessage !== ""
                ? config.messageSettings.developerMessage
                : "You are not authorized to use this command",
            ephemeral: true,
          });

          return;
        } else if (config.users?.developers?.length <= 0) {
          await interaction.reply({
            content:
              config.messageSettings.missingDevIDsMessage !== undefined &&
                config.messageSettings.missingDevIDsMessage !== null &&
                config.messageSettings.missingDevIDsMessage !== ""
                ? config.messageSettings.missingDevIDsMessage
                : "This is a developer only command, but unable to execute due to missing user IDs in configuration file.",

            ephemeral: true,
          });

          return;
        }
      }

      if (command.options?.nsfw && !interaction.channel.nsfw) {
        await interaction.reply({
          content:
            config.messageSettings.nsfwMessage !== undefined &&
              config.messageSettings.nsfwMessage !== null &&
              config.messageSettings.nsfwMessage !== ""
              ? config.messageSettings.nsfwMessage
              : "The current channel is not a NSFW channel",

          ephemeral: true,
        });

        return;
      }

      if (command.options?.cooldown) {
        const isGlobalCooldown = command.options.globalCooldown;
        const cooldownKey = isGlobalCooldown ? 'global_' + command.structure.name : interaction.user.id;
        const cooldownFunction = () => {
          let data = cooldown.get(cooldownKey);

          data.push(interaction.commandName);

          cooldown.set(cooldownKey, data);

          setTimeout(() => {
            let data = cooldown.get(cooldownKey);

            data = data.filter((v) => v !== interaction.commandName);

            if (data.length <= 0) {
              cooldown.delete(cooldownKey);
            } else {
              cooldown.set(cooldownKey, data);
            }
          }, command.options.cooldown);
        };

        if (cooldown.has(cooldownKey)) {
          let data = cooldown.get(cooldownKey);

          if (data.some((v) => v === interaction.commandName)) {
            const cooldownMessage = (isGlobalCooldown
              ? config.messageSettings.globalCooldownMessage ?? "Slow down buddy! This command is on a global cooldown ({cooldown}s)."
              : config.messageSettings.cooldownMessage ?? "Slow down buddy! You're too fast to use this command ({cooldown}s).").replace(/{cooldown}/g, command.options.cooldown / 1000);

            await interaction.reply({
              content: cooldownMessage,
              ephemeral: true,
            });

            return;
          } else {
            cooldownFunction();
          }
        } else {
          cooldown.set(cooldownKey, [interaction.commandName]);
          cooldownFunction();
        }
      }

      command.run(client, interaction);

    } catch (error) {
      log(error, "err");
      await interaction.reply({
        content: "There was an issue while executing that command!",
        ephemeral: true,
      });
    }
  },
};
