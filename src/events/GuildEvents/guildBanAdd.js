import { EmbedBuilder, Events } from 'discord.js';
import config from '../../config.js';
import ExtendedClient from '../../class/ExtendedClient.js';
import { time } from '../../functions.js';

export default {
  event: Events.GuildBanAdd,
  /**
   *
   * @param {ExtendedClient} client
   * @param {import('discord.js').GuildBan} ban
   * @returns
   */
  run: async (client, ban) => {

    if (!(config.channels.modLogs.enabled && config.channels.modLogs.channel)) return;

    const modLogsChannel = client.channels.cache.get(config.channels.modLogs.channel);

    if (!modLogsChannel || modLogsChannel.guildId !== ban.guild.id) return;

    try {
      const data = [
        `**User**: ${ban.user.toString()}`,
        `**Reason**: ${ban.reason}`,
        `**Date**: ${time(Date.now(), 'D')} (${time(Date.now(), 'R')})`,
      ];

      await modLogsChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('Guild Ban Add')
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(data.join('\n'))
            .setColor('Red')
        ]
      });
    } catch (err) {
      console.error(err);
    };

  }
};
