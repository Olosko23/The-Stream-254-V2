const express = require("express");
const router = express.Router();
const upload = require("../middlewares/fileUpload");
const { protect } = require("../middlewares/authMiddleware");
const {
  createChannel,
  deleteChannel,
  updateChannel,
  getChannel,
  addToFavorites,
  getFavoriteChannels,
  getAllChannels,
} = require("../controllers/channelController");

router.post("/create", protect, upload.single("logo"), createChannel);
router.delete("/delete/:id", protect, deleteChannel);
router.put("/update/:id", protect, updateChannel);
router.get("/:id", protect, getChannel);
router.get("/channels", protect, getAllChannels);
router.post("/add/:id", protect, addToFavorites); // :id is the channel ID
router.get("/favorites", protect, getFavoriteChannels);

module.exports = router;
