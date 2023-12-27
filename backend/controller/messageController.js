const asyncHandler = require('../middleware/asyncHandler');
const Chat = require('../model/chatModel');
const Message = require('../model/messageModel');
const BMError = require('../utils/error');

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const getAllMessages = asyncHandler(async (req, res) => {
	const { chatId } = req.params;

	const message = await Message.find({ chat: chatId })
		.populate('sender', 'name email pic')
		.populate('chat');

	res.status(200).json({
		success: true,
		message
	});
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
	const { content, chatId } = req.body;

	if (!content || !chatId) {
		throw new BMError(400, 'All fields required');
	}

	let message = await Message.create({
		sender: req.user._id,
		content,
		chat: chatId
	});

	message = await Message.findById(message._id)
		.populate('sender', 'name email pic')
		.populate('sender', 'name email pic')
        .populate({
            path: 'chat',
            populate: [
            { path: 'groupAdmin', select: 'name email pic' },
            { path: 'users', select: 'name email pic' }
            ]
        });

    await Chat.findByIdAndUpdate(chatId,{latestMessage: message},{new: true})

	res.status(200).json({
		success: true,
		message
	});
});

module.exports = { getAllMessages, sendMessage };
