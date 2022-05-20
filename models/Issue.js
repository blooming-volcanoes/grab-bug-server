const mongoose = require('mongoose');

const Issue = mongoose.Schema(
    {
        reporterName: {
            type: String,
            required: [true, 'Please give a reporter name'],
        },
        title: {
            type: String,
        },
        severity: {
            type: String,
            enum: ['low', 'moderate', 'high', 'extreme', 'critical'],
        },
        status: {
            type: String,
            enum: ['reported', 'approved', 'rejected'],
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
        comments: [
            {
                text: String,
                commentedBy: String,
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true },
);
const model = mongoose.model('Issue', Issue);

module.exports = model;
