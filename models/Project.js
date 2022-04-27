const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'Users',
        },
        assignedPeople: [
            {
                assignedUser: {
                    type: mongoose.Types.ObjectId,
                    ref: 'Users',
                },
                role: String,
            },
        ],
        deadline: {
            type: Date,
        },
    },
    { timestamps: true },
);

// hashing the password before save to the DB
const Projects = mongoose.model('Projects', projectSchema);
const DeleteProject = mongoose.model('deleteProject', projectSchema);

module.exports = { Projects, DeleteProject };
