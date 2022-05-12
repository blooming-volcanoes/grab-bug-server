const Message = require('../models/messageModal');

const Conversation = require('../models/conversationModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

// Get all message

exports.createMessage = catchAsyncErrors(async (req, res) => {
    const { recipient, text, media, call } = req.body;
    if (!recipient || (!text.trim() && media.length === 0 && !call)) return;

    const newConversation = await Conversation.findOneAndUpdate(
        {
            $or: [
                { recipients: [req.user._id, recipient] },
                { recipients: [recipient, req.user._id] },
            ],
        },
        {
            recipients: [req.user._id, recipient],
            text,
            media,
        },
        { new: true, upsert: true },
    );

    const newMessage = new Message({
        conversation: newConversation._id,
        sender: req.user._id,
        recipient,
        text,
        media,
        call,
    });

    await newMessage.save();

    res.json({ msg: 'Create Success' });
});

exports.getConversation = catchAsyncErrors(async (req, res) => {
    const features = new APIfeatures(
        Conversation.find({ recipients: req.user._id }),
        req.query,
    ).paginating();

    const conversation = await features.query.sort('-updatedAt').populate('recipients');

    res.json({
        conversation,
        result: conversation.length,
    });
});

exports.getMessage = catchAsyncErrors(async (req, res) => {
    const features = new APIfeatures(
        Message.find({
            $or: [
                { sender: req.user._id, recipient: req.params.id },
                { sender: req.params.id, recipient: req.user._id },
            ],
        }),
        req.query,
    ).paginating();

    const messages = await features.query.sort('-createdAt');

    res.json({
        messages,
        result: messages.length,
    });
});
