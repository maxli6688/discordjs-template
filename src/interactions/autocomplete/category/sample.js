import { AutocompleteInteraction } from 'discord.js';
import ExtendedClient from '../../../class/ExtendedClient.js';


export default {
  name: "sample",
  commandName: 'autocomplete',
  options: {
    public: true
  },
  /**
   *
   * @param {ExtendedClient} client
   * @param {AutocompleteInteraction} interaction
   */
  run: async (client, interaction) => {
    const currentInput = interaction.options.getFocused();

    const choices = ["your", "choices"];

    const filtered = choices.filter((choice) =>
      choice.toLowerCase().startsWith(currentInput.toLowerCase())
    );

    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
    return;
  },
};
