const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter your name'],
    },
    description: {
        type: String,
    },
    created_By: {
        id: mongoose.Types.ObjectId,
    },
    assigned_person: {
        id: mongoose.Types.ObjectId,
    },
    deadline: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// hashing the password before save to the DB
module.exports = mongoose.model('Projects', projectSchema);
