const mongoose = require('mongoose');

const Issue = mongoose.Schema(
    {
        reporter_name: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: 'reported',
        },
        bug_category: {
            type: String,
            default: 'high',
            required: true,
        },
        bug_description: {
            type: String,
            required: true,
        },
        project: {
            type: mongoose.Types.ObjectId,
            ref: 'Project',
        },
    },
    { timestamps: true },
);
const model = mongoose.model('Issue', Issue);

module.exports = model;
