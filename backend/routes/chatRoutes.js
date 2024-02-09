const express = require('express')
const { protect } = require('../middleware/auth')
const { getOrCreate, getChats, createGroupChat, renameGroup, removeFromGroup, addToGroup, leaveGroup } = require('../controller/chatController')

const router = express.Router()

router.route('/').post(protect , getOrCreate)
router.route('/').get( protect ,getChats)
router.route('/group').post(protect , createGroupChat)
router.route('/group/rename').put(protect, renameGroup)
router.route("/group/remove-user").put(protect, removeFromGroup);
router.route("/group/add-user").put(protect, addToGroup);
router.route("/group/leave").put(protect, leaveGroup);

module.exports = router