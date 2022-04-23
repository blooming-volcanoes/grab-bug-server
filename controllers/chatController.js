const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Chat = require('../models/ChatModel');
const User = require('../models/User');

// Creating Chat

exports.accessChat = catchAsyncErrors(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'UserId param not sent with request',
        });
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {
                users: { $elemMatch: { $eq: req.user._id } },
            },
            {
                users: { $elemMatch: { $eq: userId } },
            },
        ],
    })
        .populate('users', '-password')
        .populate('latestMessage');

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name pic email',
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId],
        };
        try {
            const createdChat = await Chat.create(chatData);

            const fullChat = await Chat.findOne({
                _id: createdChat._id,
            }).populate('users', '-password');

            res.status(200).json({
                success: true,
                fullChat,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
});

// Fetching Chat

exports.fetchChats = catchAsyncErrors(async (req, res) => {
    const chat = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort({ upadatedAt: -1 });

    const result = await User.populate(chat, {
        path: 'latestMessage.sender',
        select: 'name pic email',
    });

    res.status(200).json({
        success: true,
        chat,
    });
});

//  const createGroupChat =
