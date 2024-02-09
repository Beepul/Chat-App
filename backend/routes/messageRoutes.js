const express = require("express");
const { getAllMessages, sendMessage } = require("../controller/messageController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/:chatId").get(protect, getAllMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;