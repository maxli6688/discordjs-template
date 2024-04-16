import ExtendedClient from './class/ExtendedClient.js';

const client = new ExtendedClient();

// await connectDatabase();
client.start();

// Handles errors and avoids crashes, better to not remove them.
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
