const mongoose = require('mongoose');

const Issue = mongoose.Schema({
    reporter_name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'reported',
    },
});
const model = mongoose.model('Issue', Issue);

module.exports = model;
