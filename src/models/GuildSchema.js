// const { model, Schema } = require('mongoose');
import { model, Schema } from 'mongoose';

const Guild = model('GuildSchema',
  new Schema({
    guild: {
      type: String,
      required: true
    },
    prefix: {
      type: String
    }
  })
);

export default Guild;
