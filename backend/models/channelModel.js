const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  channel_number: {
    type: Number,
    required: true,
    unique: true,
  },
  category: {
    type: [String],
  },
  logo: {
    type: String,
  },
});

const Channel = mongoose.model("Channel", channelSchema);

module.exports = Channel;
