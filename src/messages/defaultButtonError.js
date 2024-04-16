/**
 * @file Default Error Message On Error Button Interaction
 * @author Max.li
 * @since 3.0.0
 */

export default {
  /**
   * @description Executes when the button interaction could not be fetched.
   * @author Max.li
   * @param {import('discord.js').ButtonInteraction} interaction The Interaction Object of the command.
   */

  async execute (interaction) {
    await interaction.reply({
      content: "There was an issue while fetching this button!",
      ephemeral: true,
    });
    return;
  },
};
