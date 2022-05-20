const mongoose = require('mongoose');

const inviteUser = new mongoose.Schema({
    email: {
        type: String,
    },
    token: {
        type: String,
    },
    boardId: {
        type: String,
    },
});

module.exports = mongoose.model('invitation', inviteUser);
