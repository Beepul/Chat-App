const asyncHandler = require('../middleware/asyncHandler');
const Chat = require('../model/chatModel');
const User = require('../model/userModel');
const BMError = require('../utils/error');

//@description     Create One to One Chat, if already exist Fetch One to One chat
//@route           POST /api/chat/
//@access          Protected

const getOrCreate = asyncHandler(async (req, res, next) => {
	const { userId } = req.body;

	// console.log('asdasdk')
	if (!userId) {
		throw new BMError(400, 'Please select the user you want to chat');
	}

	const user = await User.findById(userId);

	if (!user) {
		throw new BMError(404, 'User not found');
	}

	const existingChat = await Chat.findOne({
		isGroupChat: false,
		$and: [ { users: { $elemMatch: { $eq: req.user._id } } }, { users: { $elemMatch: { $eq: userId } } } ]
	})
		.populate('users', '-password')
		.populate('latestMessage');

	if (existingChat) {
		return res.status(200).json({
			success: true,
			chat: existingChat
		});
	}

	const newChat = await Chat.create({
		chatName: user.name,
		users: [ req.user._id, userId ],
		groupAdmin: req.user._id
	})
	const chat = await Chat.findById(newChat._id).populate('users', '-password').populate('groupAdmin', '-password');

	res.status(200).json({
		success: true,
		chat: chat
	});
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const getChats = asyncHandler(async (req, res) => {
	try {
		const chats = await Chat.find({
			users: { $elemMatch: { $eq: req.user._id } }
		})
			.populate('users', '-password')
			.populate('groupAdmin', '-password')
			.populate({
				path: "latestMessage",
				populate: {
				  path: "sender",
				  select: "-password"
				}
			})
			.sort({ updatedAt: -1 });

		res.status(200).json({
			success: true,
			chats
		});
	} catch (error) {
		throw new BMError(400, error.message);
	}
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
	const { name, users } = req.body;

	if (!name || !users) {
		throw new BMError(400, 'Please fill all the fields');
	}

	if (users.length < 2) {
		throw new BMError(400, 'More than 2 users are required to form a group chat');
	}

	users.push(req.user);

	try {
		const groupChat = await Chat.create({
			chatName: req.body.name,
			users: users,
			isGroupChat: true,
			groupAdmin: req.user._id
		});

		const fullGroupChat = await Chat.findById(groupChat._id)
			.populate('users', '-password')
			.populate('groupAdmin', '-password');

		res.status(200).json({
			success: true,
			groupChat: fullGroupChat
		});
	} catch (error) {
		throw new BMError(400, error.message);
	}
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
	const { chatId, chatName } = req.body;

	if (!chatId || !chatName) {
		throw new BMError(400, 'Please enter all fields');
	}

	const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName: chatName }, { new: true })
		.populate('users', '-password')
		.populate('groupAdmin', '-password');

	if (!updatedChat) {
		throw new BMError(404, 'Group chat not found');
	} else {
		res.status(200).json({
			success: true,
			groupChat: updatedChat
		});
	}
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
	const { chatId, userId } = req.body;

    if (!chatId || !userId) {
		throw new BMError(400, 'Please enter all fields');
	}

	const groupChat = await Chat.findById(chatId);

	if (!groupChat) {
		throw new BMError(404, 'Group chat not found');
	}

    if(req.user._id.toString() === userId){
        throw new BMError(404, 'You cannot remove yourself. Try leaving the chat');
    }

	if (groupChat.groupAdmin.toString() !== req.user._id.toString()) {
		throw new BMError(401, 'You are not authorized to remove user');
	}

	const updatedChat = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId }}, { new: true })
		.populate('users', '-password')
		.populate('groupAdmin', '-password');

    if(!updatedChat){
        throw new BMError(404, 'Group chat not found');
    }else{
        res.status(200).json({
            success: true,
            groupChat: updatedChat
        });
    }
});

// @desc    Add user to Group
// @route   PUT /api/chat/group/add-user
// @access  Protected
const addToGroup = asyncHandler(async(req,res) => {
    const {chatId, userId} = req.body

    if (!chatId || !userId) {
		throw new BMError(400, 'Please enter all fields');
	}

    const groupChat = await Chat.findById(chatId);

	if (!groupChat) {
		throw new BMError(404, 'Group chat not found');
	}

    if (groupChat.groupAdmin.toString() !== req.user._id.toString()) {
		throw new BMError(401, 'You are not authorized to add user');
	}

    if (groupChat.users.includes(userId)) {
        throw new BMError(409, 'User is already in the group');
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: { users: userId },
        },
        {
          new: true,
        }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if(!updatedChat){
        throw new BMError(404, 'Group chat not found');
    }else{
        res.status(200).json({
            success: true,
            groupChat: updatedChat
        });
    }
})

// @desc    Leave Group
// @route   Put /api/chat/group/leave
// @access  Protected
const leaveGroup = asyncHandler(async(req,res) => {
    const { chatId } = req.body;

    if (!chatId) {
        throw new BMError(400, 'Please provide a chatId');
    }

    const groupChat = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: req.user._id } },
        { new: true }
      );

    if (!groupChat) {
        throw new BMError(404, 'Group chat not found');
    }
    
    res.status(200).json({
        success: true,
        message: 'You have left the group successfully',
    });
})

module.exports = { getOrCreate, getChats, createGroupChat, renameGroup, removeFromGroup, addToGroup ,leaveGroup};
