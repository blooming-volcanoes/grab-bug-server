const mongoose = require('mongoose');

const archiveSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
    },

    name: {
        type: String,
    },
    description: {
        type: String,
    },
    created_By: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    assigned_person: {
        type: String,
    },
    deadline: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Archives', archiveSchema);
