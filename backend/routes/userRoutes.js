const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/fileUpload");
const {
  register,
  login,
  updateProfile,
  getUserProfile,
  logout,
  serverStatus,
  resetPassword,
  sentResetLink,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", serverStatus);
router.post("/login", login);
router.post("/register", register);
router.post("/reset", sentResetLink);
router.post("/reset/new_password", resetPassword);
router.get("/profile", protect, getUserProfile);
router.post("/profile", protect, upload.single("avatar"), updateProfile);
router.post("/logout", logout);

module.exports = router;
