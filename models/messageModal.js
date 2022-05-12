const { default: mongoose } = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        conversation: { type: mongoose.Types.ObjectId, ref: 'conversation' },
        sender: { type: mongoose.Types.ObjectId, ref: 'Users' },
        recipient: { type: mongoose.Types.ObjectId, ref: 'Users' },
        text: {
            type: String,
        },
        media: {
            type: Array,
        },
        call: {
            type: Object,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('message', messageSchema);
