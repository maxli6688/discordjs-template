import {
  EmbedBuilder,
  ChannelType,
  // ExtendedClient,
  Message,
} from "discord.js";
import config from "../../config.js";
import ExtendedClient from "../../class/ExtendedClient.js";

const prefix = config.handler.prefix;

export default {
  structure: {
    name: "faq",
    description: "List all faqs of bot or info about a specific command.",
    aliases: ["faqs"],
    usage: "[command name]",
    cooldown: 5,
  },
  /**
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    const { commands } = message.client;

    // If there are no args, it means it needs whole help command.

    if (!args.length) {
      /**
       * @type {EmbedBuilder}
       * @description Help command embed object
       */

      let helpEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("List of all my commands")
        .setDescription(
          "`" + commands.map((command) => command.name).join("`, `") + "`"
        )

        .addFields([
          {
            name: "Usage",
            value: `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`,
          },
        ]);

      // Attempts to send embed in DMs.

      return message.author
        .send({ embeds: [helpEmbed] })

        .then(() => {
          if (message.channel.type === ChannelType.DM) return;

          // On validation, reply back.

          message.reply({
            content: "I've sent you a DM with all my commands!",
          });
        })
        .catch((error) => {
          // On failing, throw error.

          console.error(
            `Could not send help DM to ${message.author.tag}.\n`,
            error
          );

          message.reply({ content: "It seems like I can't DM you!" });
        });
    }

    // If argument is provided, check if it's a command.

    /**
     * @type {String}
     * @description First argument in lower case
     */

    const name = args[0].toLowerCase();

    const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    // If it's an invalid command.

    if (!command) {
      return message.reply({ content: "That's not a valid command!" });
    }

    /**
     * @type {EmbedBuilder}
     * @description Embed of Help command for a specific command.
     */

    let commandEmbed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("Command Help");

    if (command.description)
      commandEmbed.setDescription(`${command.description}`);

    if (command.aliases)
      commandEmbed.addFields([
        {
          name: "Aliases",
          value: `\`${command.aliases.join(", ")}\``,
          inline: true,
        },
        {
          name: "Cooldown",
          value: `${command.cooldown || 3} second(s)`,
          inline: true,
        },
      ]);
    if (command.usage)
      commandEmbed.addFields([
        {
          name: "Usage",
          value: `\`${prefix}${command.name} ${command.usage}\``,
          inline: true,
        },
      ]);

    // Finally send the embed.

    message.channel.send({ embeds: [commandEmbed] });
  },
};
