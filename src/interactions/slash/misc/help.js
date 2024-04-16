/**
 * @file Sample help command with slash command.
 * @author Max.li & Thomas Fournier
 * @since 3.0.0
 * @version 3.3.0
 */

// Deconstructed the constants we need in this file.

// const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
import { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import ExtendedClient from "../../../class/ExtendedClient.js";

export default {
  // The data needed to register slash commands to Discord.

  structure: new SlashCommandBuilder()
    .setName("help")
    .setDescription(
      "List all commands of bot or info about a specific command."
    )
    // .setDescription('View all the possible commands!'),
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The specific command to see the info of.")
    ),
  options: {
    cooldown: 15000
  },

  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    /**
     * @type {string}
     * @description The "command" argument
     */
    let name = interaction.options.getString("command");

    /**
     * @type {EmbedBuilder}
     * @description Help command's embed
     */
    const helpEmbed = new EmbedBuilder().setColor("Random");



    // await interaction.deferReply();

    // let prefix = config.handler.prefix;

    // if (config.handler?.mongodb?.enabled) {
    //   try {
    //     const data = (await GuildSchema.findOne({ guild: message.guildId }));

    //     if (data && data?.prefix) prefix = data.prefix;
    //   } catch {
    //     prefix = config.handler.prefix;
    //   };
    // };

    // const mapIntCmds = client.applicationcommandsArray.map((v) => `\`${(v.type === 2 || v.type === 3) ? '' : '/'}${v.name}\`: ${v.description || '(No description)'}`);
    // const mapPreCmds = client.prefixcommands.map((v) => `\`${prefix}${v.structure.name}\` (${v.structure.aliases.length > 0 ? v.structure.aliases.map((a) => `**${a}**`).join(', ') : 'None'}): ${v.structure.description || '(No description)'}`);

    // await interaction.followUp({
    //   embeds: [
    //     new EmbedBuilder()
    //       .setTitle('Help command')
    //       .addFields(
    //         { name: 'Slash commands', value: `${mapIntCmds.join('\n')}` },
    //         { name: 'Prefix commands', value: `${mapPreCmds.join('\n')}` }
    //       )
    //   ]
    // });

    if (name) {
      name = name.toLowerCase();

      // If a single command has been asked for, send only this command's help.

      helpEmbed.setTitle(`Help for \`${name}\` command`);

      if (interaction.client.slashCommands.has(name)) {
        const command = interaction.client.slashCommands.get(name);

        if (command.data.description)
          helpEmbed.setDescription(
            command.data.description + "\n\n**Parameters:**"
          );
      } else {
        helpEmbed
          .setDescription(`No slash command with the name \`${name}\` found.`)
          .setColor("Red");
      }
    } else {
      // Give a list of all the commands

      helpEmbed
        .setTitle("List of all my slash commands")
        .setDescription(
          "`" +
          interaction.client.slashCommands
            .map((command) => command.data.name)
            .join("`, `") +
          "`"
        );
    }

    // Replies to the interaction!

    await interaction.reply({
      embeds: [helpEmbed],
    });
  },
};
