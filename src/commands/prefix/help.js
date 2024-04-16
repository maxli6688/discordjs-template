import { Message, EmbedBuilder } from 'discord.js';
import ExtendedClient from '../../class/ExtendedClient.js';
import config from '../../config.js';
import GuildSchema from '../../models/GuildSchema.js';


const help = {
  structure: {
    name: 'help',
    description: 'View all the possible commands!',
    aliases: ['h'],
    cooldown: 15000
  },
  /**
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {

    let prefix = config.handler.prefix;

    if (config.handler?.mongodb?.enabled) {
      try {
        const data = (await GuildSchema.findOne({ guild: message.guildId }));

        if (data && data?.prefix) prefix = data.prefix;
      } catch {
        prefix = config.handler.prefix;
      };
    };

    const mapIntCmds = client.slashCommands.map((vv) => {
      const v = vv.structure.toJSON();
      return `\`${(v.type === 2 || v.type === 3) ? '' : '/'}${v.name}\`: ${v.description || '(No description)'}`
    });
    const mapPreCmds = client.prefixCommands.map((v) => `\`${prefix}${v.structure.name}\` (${v.structure.aliases && v.structure.aliases.length > 0 ? v.structure.aliases.map((a) => `**${a}**`).join(', ') : 'None'}): ${v.structure.description || '(No description)'}`);
    await message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('Help command')
          .addFields(
            { name: 'Slash commands', value: `${mapIntCmds.join('\n')}` },
            { name: 'Prefix commands', value: `${mapPreCmds.join('\n')}` }
          )
      ]
    });

  }
};
export default help;
