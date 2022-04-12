/* eslint-disable prettier/prettier */
// const ErrorHandler = require('../lib/errorHandler');
// const sendToken = require('../lib/jwt');
// const sendEmail = require('../lib/sendEmail');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Projects = require('../models/Project');

// Creating post request
exports.projects = catchAsyncErrors(async (req, res) => {
    const project = await Projects.create(req.body);
    res.status(200).json({
        success: true,
        project,
    });
});

// Get a single project

exports.singleProject = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const project = await Projects.findById(id);
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
        { runValidators: false }
    );
    console.log(projects);
    res.status(200).json({
        success: true,
        projects,
    });
});

// Delete project
// exports.deleteProject = catchAsyncErrors(async (req, res) => {
//     const { id } = req.param;
//     const { name, description, deadline } = req.body;
//     const projects = await Projects.findById(id);
//     // projects.r;
//     res.status(200).json({
//         success: true,
//         projects,
//     });
// });
