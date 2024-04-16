import { Events } from "discord.js";
import ExtendedClient from "../../class/ExtendedClient.js";

export default {
  event: Events.MessageCreate,

  /**
   * @description Executes when a message is created and handle it.
   * @author Max.li
   * @param {ExtendedClient} client
   * @param {import('discord.js').Message} message The message which was created.
   */
  run: async (client, message) => {

    if (message.author.bot) return;
    const args = message.content.split(/ +/);
    let triggered = false;
    client.triggers.every((trigger) => {
      if (triggered) return false;
      trigger.name.every(async (name) => {
        if (triggered) return false;
        if (message.content.includes(name)) {
          try {
            trigger.run(message, args);
          } catch (error) {
            console.error(error);
            message.reply({
              content: "there was an error trying to execute that trigger!",
            });
          }
          triggered = true;
          return false;
        }
      });
    });
  },
};
