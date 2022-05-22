/* eslint-disable prettier/prettier */
// const ErrorHandler = require('../lib/errorHandler');
// const sendToken = require('../lib/jwt');
// const sendEmail = require('../lib/sendEmail');
const mongoose = require('mongoose');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const { Projects } = require('../models/Project');
const { DeleteProject } = require('../models/Project');
const Users = require('../models/User');
// const { find } = require('../models/projectArchives');
// const Archive = require('../models/projectArchives');
// const archive = new Archive;

// Creating post request
exports.projects = catchAsyncErrors(async (req, res) => {
    //  Project creator id
    const project = await Projects.create({ ...req.body, createdBy: req.user._id });
    // the project is created
    // now take the project _id, query the project,
    // push the project creator to it's assignedPeople array and assign a role of 'admin' to the user
    const projectUpdated = await Projects.findByIdAndUpdate(
        { _id: project._id },
        {
            $push: {
                assignedPeople: { assignedUser: req.user._id, role: 'admin' },
            },
        },
        { new: true },
    );
    // from 'users' collection, modify the user's 'isActive' property to 'true'
    await Users.findByIdAndUpdate({ _id: req.user._id }, { isActive: true }, { new: true });
    // from 'users' collection, for the current user who just created the project,
    // populate the 'projects' array with the newly created project id
    const updatedUser = await Users.findByIdAndUpdate(
        { _id: req.user._id },
        {
            $push: {
                projects: {
                    projectId: project._id,
                    role: 'admin',
                },
            },
        },
        { new: true },
    );
    res.status(200).json({
        success: true,
        project: projectUpdated,
        user: updatedUser,
    });
});

// Get a single project

exports.singleProject = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const project = await Projects.findById(id)
        .populate('assignedPeople.assignedUser', 'name email')
        .populate('createdBy', 'email name')
        .populate('issues');
    res.status(200).json({
        success: true,
        project,
    });
});

// Get all project
exports.allProject = catchAsyncErrors(async (req, res) => {
    const projects = await Projects.find({});
    res.status(200).json({
        success: true,
        projects,
    });
});

// Edit project
exports.editProjectDetails = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const { name, description, deadline } = req.body;
    const projects = await Projects.findByIdAndUpdate(
        id,
        { name, description, deadline },
        { runValidators: false },
    );
    res.status(200).json({
        success: true,
        projects,
    });
});

// Delete project
exports.deleteProject = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const { name, description, deadline } = req.body;
    // const projects = await Projects.findById(id);

    let result = await Projects.findOne({ _id: id });

    let swap = new DeleteProject(result.toJSON());

    result.remove();
    swap.save();
    res.status(200).json({
        success: true,
        swap,
    });
});

// Get Archived Project

exports.archiveProject = catchAsyncErrors(async (req, res) => {
    const result = await DeleteProject.find({});

    res.status(200).json({
        success: true,
        result,
    });
});

//Single archived project

exports.singleArchive = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;

    const result = await DeleteProject.findById(id);

    res.status(200).json({
        success: true,
        result,
    });
});
