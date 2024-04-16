import { connect } from 'mongoose';
import config from '../config.js';
import { log } from '../functions.js';

const dbinit = async () => {
  log('Started connecting to MongoDB...', 'warn');

  await connect(process.env.MONGODB_URI || config.handler.mongodb.uri).then(() => {
    log('MongoDB is connected to the atlas!', 'done')
  });
};

export default dbinit;
