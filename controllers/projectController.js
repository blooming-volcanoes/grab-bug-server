/* eslint-disable prettier/prettier */
// const ErrorHandler = require('../lib/errorHandler');
// const sendToken = require('../lib/jwt');
// const sendEmail = require('../lib/sendEmail');
const mongoose = require('mongoose');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const { Projects } = require('../models/Project');
const { DeleteProject } = require('../models/Project');
// const { find } = require('../models/projectArchives');
// const Archive = require('../models/projectArchives');
// const archive = new Archive;

// Creating post request
exports.projects = catchAsyncErrors(async (req, res) => {
    //  Project creator id
    const project = await Projects.create({ ...req.body, createdBy: req.user._id });
    res.status(200).json({
        success: true,
        project,
    });
});

// Get a single project

exports.singleProject = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const project = await Projects.findById(id)
        .populate('assignedPeople.assignedUser', 'name email')
        .populate('createdBy', 'email name');
    res.status(200).json({
        success: true,
        project,
    });
});

exports.singleProjectWithAssignedUser = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const project = await Projects.findById(id).populate('assignedPeople');
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
    console.log(id);
    const { name, description, deadline } = req.body;
    const projects = await Projects.findByIdAndUpdate(
        id,
        { name, description, deadline },
        { runValidators: false },
    );
    console.log(projects);
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
