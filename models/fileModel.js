const mongoose = require('mongoose');

const file = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        attachments: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true },
);
const model = mongoose.model('File', file);

module.exports = model;
