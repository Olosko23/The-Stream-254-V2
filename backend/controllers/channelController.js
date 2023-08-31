const Channel = require("../models/channelModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

//Create Channel
// controllers/channelController.js
const createChannel = asyncHandler(async (req, res) => {
  try {
    const { name, channel_number, category } = req.body;
    const logoPath = req.file ? req.file.path : null;

    const newChannel = new Channel({
      name,
      channel_number,
      category,
      logo: logoPath,
    });

    const savedChannel = await newChannel.save();
    res.status(201).json(savedChannel);
  } catch (error) {
    res.status(500).json({ error: "Unable to create channel." });
  }
});

// controllers/channelController.js
const deleteChannel = asyncHandler(async (req, res) => {
  try {
    const channelId = req.params.id;

    const deletedChannel = await Channel.findByIdAndDelete(channelId);
    if (!deletedChannel) {
      return res.status(404).json({ error: "Channel not found." });
    }

    res.status(200).json({ message: "Channel deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete channel." });
  }
});

// controllers/channelController.js
const updateChannel = asyncHandler(async (req, res) => {
  try {
    const channelId = req.params.id;
    const updates = req.body;

    const updatedChannel = await Channel.findByIdAndUpdate(channelId, updates, {
      new: true,
    });

    if (!updatedChannel) {
      return res.status(404).json({ error: "Channel not found." });
    }

    res.status(200).json(updatedChannel);
  } catch (error) {
    res.status(500).json({ error: "Unable to update channel." });
  }
});

// controllers/channelController.js
const getChannel = asyncHandler(async (req, res) => {
  try {
    const channelId = req.params.id;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found." });
    }

    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch channel." });
  }
});

// controllers/favoriteController.js
const addToFavorites = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const channelId = req.params._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.favoriteChannels.includes(channelId)) {
      return res.status(400).json({ error: "Channel already in favorites." });
    }

    user.favoriteChannels.push(channelId);
    await user.save();

    res.status(200).json({ message: "Channel added to favorites." });
  } catch (error) {
    res.status(500).json({ error: "Unable to add channel to favorites." });
  }
});

// controllers/favoriteController.js
const getFavoriteChannels = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("favoriteChannels");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user.favoriteChannels);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch favorite channels." });
  }
});

// controllers/channelController.js
const getAllChannels = asyncHandler(async (req, res) => {
  try {
    const channels = await Channel.find();
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch channels." });
  }
});

module.exports = {
  createChannel,
  deleteChannel,
  updateChannel,
  getChannel,
  addToFavorites,
  getFavoriteChannels,
  getAllChannels,
};
