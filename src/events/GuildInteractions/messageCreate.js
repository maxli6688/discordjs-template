import { ChannelType, Events, Message } from "discord.js";
import config from "../../config.js";
import { log } from "../../functions.js";
import GuildSchema from "../../models/GuildSchema.js";
import ExtendedClient from "../../class/ExtendedClient.js";
import onMention from "../../messages/onMention.js";

const cooldown = new Map();

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Prefix regex, we will use to match in mention prefix.
// prefixCommands
export default {
  event: Events.MessageCreate,
  /**
   * @description Executes when a message is created and handle it.
   * @author Max.li
   * @param {ExtendedClient} client
   * @param {Message} message The message which was created.
   * @returns
   */
  run: async (client, message) => {

    // Checks if the bot is mentioned in the message all alone and triggers onMention trigger.
    // You can change the behavior as per your liking at ./messages/onMention.js
    // if (
    //   message.content == `<@${client.user.id}>` ||
    //   message.content == `<@!${client.user.id}>`
    // ) {
    //   onMention.execute(message);
    //   return;
    // }

    if (message.author.bot || message.channel.type === ChannelType.DM) return;

    if (!config.handler.commands.prefix) return;

    const owner = config.users.ownerId;
    let prefix = config.handler.prefix;

    if (config.handler?.mongodb?.enabled) {
      try {
        const guildData = await GuildSchema.findOne({ guild: message.guildId });

        if (guildData && guildData?.prefix) prefix = guildData.prefix;
      } catch {
        prefix = config.handler.prefix;
      }
    }
    /*

    const checkPrefix = prefix.toLowerCase();
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(checkPrefix)})\\s*`
    );
    // Checks if message content in lower case starts with bot's mention.
    if (!prefixRegex.test(content.toLowerCase())) return;

    // Checks and returned matched prefix, either mention or prefix in config.
    const [matchedPrefix] = message.content.toLowerCase().match(prefixRegex);
    // The Message Content of the received message seperated by spaces (' ') in an array, this excludes prefix and command/alias itself.
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    if (!message.content.startsWith(matchedPrefix)) return;

    */
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandInput = args.shift().toLowerCase();

    if (!commandInput.length) return;

    let command =
      client.prefixCommands.get(commandInput) ||
      client.prefixCommands.get(
        client.collection.aliases.get(commandInput)
      );

    if (!command) return;
    /*
    // Owner Only Property, add in your command properties if true.
    if (command.ownerOnly && message.author.id !== owner) {
      return message.reply({ content: "This is a owner only command!" });
    }

    // Guild Only Property, add in your command properties if true.
    if (command.guildOnly && message.channel.type === ChannelType.DM) {
      return message.reply({
        content: "I can't execute that command inside DMs!",
      });
    }

    // Author perms property
    // Will skip the permission check if command channel is a DM. Use guildOnly for possible error prone commands!
    if (command.permissions && message.channel.type !== ChannelType.DM) {
      const authorPerms = message.channel.permissionsFor(message.author);
      if (!authorPerms || !authorPerms.has(command.permissions)) {
        return message.reply({ content: "You can not do this!" });
      }
    }

    // Args missing
    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;

      if (command.usage) {
        reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
      }

      return message.channel.send({ content: reply });
    }

    // Cooldowns
    const { cooldowns } = client;

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply({
          content: `please wait ${timeLeft.toFixed(
            1
          )} more second(s) before reusing the \`${command.name}\` command.`,
        });
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    */

    if (command.structure?.ownerOnly) {
      if (message.author.id !== config.users.ownerId) {
        await message.reply({
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

    if (
      command.structure?.permissions &&
      !message.member.permissions.has(command.structure?.permissions)
    ) {
      await message.reply({
        content:
          config.messageSettings.notHasPermissionMessage !== undefined &&
            config.messageSettings.notHasPermissionMessage !== null &&
            config.messageSettings.notHasPermissionMessage !== ""
            ? config.messageSettings.notHasPermissionMessage
            : "You do not have the permission to use this command.",
        ephemeral: true
      });

      return;
    }

    if (command.structure?.developers) {
      if (!config.users.developers.includes(message.author.id)) {
        await message.reply({
          content:
            config.messageSettings.developerMessage !== undefined &&
              config.messageSettings.developerMessage !== null &&
              config.messageSettings.developerMessage !== ""
              ? config.messageSettings.developerMessage
              : "You are not authorized to use this command",
          ephemeral: true
        });

        return;
      }
    }

    if (command.structure?.nsfw && !message.channel.nsfw) {
      await message.reply({
        content:
          config.messageSettings.nsfwMessage !== undefined &&
            config.messageSettings.nsfwMessage !== null &&
            config.messageSettings.nsfwMessage !== ""
            ? config.messageSettings.nsfwMessage
            : "The current channel is not a NSFW channel.",
        ephemeral: true
      });

      return;
    }

    if (command.structure?.cooldown) {
      const cooldownFunction = () => {
        let data = cooldown.get(message.author.id);

        data.push(commandInput);

        cooldown.set(message.author.id, data);

        setTimeout(() => {
          let data = cooldown.get(message.author.id);

          data = data.filter((v) => v !== commandInput);

          if (data.length <= 0) {
            cooldown.delete(message.author.id);
          } else {
            cooldown.set(message.author.id, data);
          }
        }, command.structure?.cooldown);
      };

      if (cooldown.has(message.author.id)) {
        let data = cooldown.get(message.author.id);

        if (data.some((v) => v === commandInput)) {
          await message.reply({
            content:
              (config.messageSettings.cooldownMessage !== undefined &&
                config.messageSettings.cooldownMessage !== null &&
                config.messageSettings.cooldownMessage !== ""
                ? config.messageSettings.cooldownMessage
                : "Slow down buddy! You're too fast to use this command ({cooldown}s).").replace(/{cooldown}/g, command.structure.cooldown / 1000),
            ephemeral: true
          });

          return;
        } else {
          cooldownFunction();
        }
      } else {
        cooldown.set(message.author.id, [commandInput]);

        cooldownFunction();
      }
    }

    try {
      command.run(client, message, args);
    } catch (error) {
      log(error, "err");
      message.reply({
        content: "There was an error trying to execute that command!",
      });
    }

  },
};
