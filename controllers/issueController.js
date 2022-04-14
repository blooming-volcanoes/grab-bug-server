/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const Errorhandler = require('../lib/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Issue = require('../models/Issue');
const Archive = require('../models/issuesArchives');

// Create an issue (POST)
exports.createIssues = catchAsyncErrors(async (req, res) => {
    const issue = req.body;
    const result = await new Issue(issue).save();
    res.send({
        success: true,
        result
    });
});

// Read an issue (GET)
exports.getAnIssue = catchAsyncErrors(async (req, res) => {
    const { issueId } = req.params;
    const result = await Issue.findOne({ _id: issueId });
    res.send({
        success: true,
        result
    });
});

// Read all issues (GET)
exports.getAllIssues = catchAsyncErrors(async (req, res) => {
    const result = await Issue.find({}).sort({ createdAt: -1 });
    res.send({
        success: true,
        result
    });
});

// Update an issue (PUT)
exports.updateAnIssue = catchAsyncErrors(async (req, res) => {
    const { issueId } = req.params;
    const result = await Issue.findByIdAndUpdate({ _id: issueId }, req.body, { new: true });
    res.send({
        success: true,
        result
    });
});

// Update the status of an issue (PUT) : - not useable
// exports.updateStatus = catchAsyncErrors(async (req, res) => {
//     const { issueId } = req.params;
//     const result = await Issue.findOne({ _id: issueId }, req.body.status, { new: true });
//     res.send(result);
// });

// Delete an issue (DELETE)
exports.deleteAnIssue = catchAsyncErrors(async (req, res) => {
    const { issueId } = req.params;
    const result = await Issue.findByIdAndDelete({ _id: issueId });
    if (result) {
        await new Archive(result.toJSON()).save();
        res.send({success: true, message: 'Your issue has been deleted' });
    }
});

// Read an archived issue (GET)
exports.getArchive = catchAsyncErrors(async (req, res) => {
    const { issueId } = req.params;
    const result = await Archive.findOne({ _id: issueId });
    res.send({
        success: true,
        result
    });
});

// Read all archived issues (GET)
exports.getAllArchive = catchAsyncErrors(async (req, res) => {
    const result = await Archive.find({}).sort({ createdAt: -1 });
    res.send({
        success: true,
        result
    });
});
