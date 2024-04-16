/**
 * @file Default Error Message On Error Select Menu Interaction
 * @author Max.li
 * @since 3.0.0
 */

export default {
  /**
   * @description Executes when the select menu interaction could not be fetched.
   * @author Max.li
   * @param {import('discord.js').SelectMenuInteraction} interaction The Interaction Object of the command.
   */

  async execute (interaction) {
    await interaction.reply({
      content: "There was an issue while fetching this select menu option!",
      ephemeral: true,
    });
    return;
  },
};
