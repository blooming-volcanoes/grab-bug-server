const mongoose = require('mongoose');

const Issue = mongoose.Schema(
    {
        reporterName: {
            type: String,
            required: [true, 'Please give a reporter name'],
        },
        status: {
            type: String,
            default: 'reported',
        },
        bugCategory: {
            type: String,
            default: 'high',
            required: [true, 'Please give a bug category'],
        },
        bugDescription: {
            type: String,
            required: [true, 'Please give a description'],
        },
        project: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Projects',
            required: [true, 'Project Id is needed'],
        },
    },
    { timestamps: true },
);
const model = mongoose.model('Issue', Issue);

module.exports = model;
