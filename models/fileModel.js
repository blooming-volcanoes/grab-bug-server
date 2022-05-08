const mongoose = require('mongoose');

const file = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
        },
        attachments: [
            {
                fileName: String,
                path: String,
            },
        ],
    },
    { timestamps: true },
);
const model = mongoose.model('File', file);

module.exports = model;
