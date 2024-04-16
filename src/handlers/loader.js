import { readdirSync } from 'fs';
import { log } from '../functions.js';


const moduleCommandsHandle = async (client, importFilePath, type) => {
  let module = await import(importFilePath);
  module = module.default;
  if (!module) return;

  if (!module.structure?.name || !module.run) {
    log('Unable to load the command ' + importFilePath + ' due to missing \'structure#name\' or/and \'run\' properties.', 'warn');
    return;
  }
  if (['prefixCommands', 'slashCommands', 'contextCommands'].includes(type)) {
    client[type].set(module.structure.name, module);
    log('Loaded new command: ' + importFilePath, 'info');
  }

  if (module.structure.aliases && Array.isArray(module.structure.aliases)) {
    module.structure.aliases.forEach((alias) => {
      client.collection.aliases.set(alias, module.structure.name);
    });
  };

  // client.collection.interactioncommands.set(module.structure.name, module); // not  commands
  // client.applicationcommandsArray.push(module.structure); // not prefix commands

}

const moduleInteractionsHandle = async (client, importFilePath, type) => {
  let module = await import(importFilePath);
  module = module.default;
  if (!module) return;

  const attr = type === 'autocompleteInteractions' ? 'commandName' : 'customId';
  if (!module[attr] || !module.run) {
    log('Unable to load the component ' + importFilePath + ' due to missing \'' + attr + '\' or/and \'run\' properties.', 'warn');
    return;
  }
  if (['buttonInteractions', 'selectInteractions', 'modalInteractions', 'autocompleteInteractions'].includes(type)) {
    client[type].set(module[attr], module);
    log(`Loaded new component: ${importFilePath}`, 'info');
  }
}

const moduleTriggersHandle = async (client, importFilePath, type) => {
  let module = await import(importFilePath);
  module = module.default;
  if (!module) return;

  client.triggers.set(module.name, module);

  log('Loaded new trigger: ' + importFilePath, 'info');
}

const moduleEventsHandle = async (client, importFilePath, type) => {
  let module = await import(importFilePath);
  module = module.default;
  if (!module) return;

  if (!module.event || !module.run) {
    log('Unable to load the event ' + importFilePath + ' due to missing \'name\' or/and \'run\' properties.', 'warn');
    return;
  };

  log('Loaded new event: ' + importFilePath, 'info');

  if (module.once) {
    client.once(module.event, (...args) => module.run(client, ...args));
  } else {
    client.on(module.event, async (...args) => await module.run(client, ...args));
  };
}

/*
一个监听执行多次 vs 多个监听执行一次
// import { Interaction } from "discord.js";
import { CommandList } from "../commands/_CommandList";

export const onInteraction = async (interaction) => {
  if (interaction.isCommand()) {
    for (const Command of CommandList) {
      if (interaction.commandName === Command.data.name) {
        await Command.run(interaction);
        break;
      }
    }
  }
};
*/


/**
 * 处理当前目录和子目录下的命令
 * commands: prefixCommands, slashCommands, contextCommands
 * interactions: buttonInteractions, selectInteractions, modalInteractions, autocompleteInteractions
 * Events: Events
 * @param {*} client
 * @param {*} path
 * @param {string} type client[collectionName], except events
 */
export const moduleHandle = async (client, path, type) => {
  let moduleImportHandle = moduleCommandsHandle
  if (type.endsWith('Interactions')) moduleImportHandle = moduleInteractionsHandle
  if (type.endsWith('Events')) moduleImportHandle = moduleEventsHandle
  if (type.endsWith('Triggers')) moduleImportHandle = moduleTriggersHandle

  const modulesDir = readdirSync(path);
  for (const module of modulesDir) {
    if (module.endsWith('.md')) continue;
    if (module.endsWith('.js')) {
      await moduleImportHandle(client, `${path.replace('./src/', '../')}${module}`, type);
      continue;
    };
    const submodFiles = readdirSync(`${path}${module}`)
      .filter((file) => file.endsWith(".js"));
    for (const submodule of submodFiles) {
      await moduleImportHandle(client, `${path.replace('./src/', '../')}${module}/${submodule}`, type);
    }
  }
}
