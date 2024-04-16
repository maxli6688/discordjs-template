
import { Message } from "discord.js";
import ExtendedClient from "../../../class/ExtendedClient.js";

const nsfw = {
  structure: {
    name: "nsfw",
    description: "Nsfw Command",
    aliases: ["ns"],
    permissions: "SendMessages",
    cooldown: 5000,
    nsfw: true,
  },
  /**
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    await message.reply({
      content: "NSFW Command",
    });
  },
};

export default nsfw;
