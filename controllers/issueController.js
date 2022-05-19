/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const Errorhandler = require('../lib/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Issue = require('../models/Issue');
const Archive = require('../models/issuesArchives');
const { Projects } = require('../models/Project');

// Create an issue (POST)
exports.createIssues = catchAsyncErrors(async (req, res) => {
    const issue = req.body;
    const newIssue = await new Issue(issue).save();
    if (newIssue._id) {
        const data = await Projects.findByIdAndUpdate(
            { _id: issue.project },
            {
                $push: {
                    issues: newIssue,
                },
            },
        );
        console.log(data);
        res.send({
            success: true,
            result: newIssue,
        });
    }
});

// Read an issue (GET)
exports.getAnIssue = catchAsyncErrors(async (req, res) => {
    const { issueId } = req.params;
    const result = await Issue.findOne({ _id: issueId }).populate('project');
    res.send({
        success: true,
        result,
    });
});

// Read all issues (GET)
exports.getAllIssues = catchAsyncErrors(async (req, res) => {
    const result = await Issue.find({}).sort({ createdAt: -1 });
    res.send({
        success: true,
        result,
    });
});

// Update an issue (PUT)
exports.updateAnIssue = catchAsyncErrors(async (req, res) => {
    const { issueId } = req.params;
    const result = await Issue.findByIdAndUpdate({ _id: issueId }, req.body, { new: true });
    res.send({
        success: true,
        result,
    });
});

// Update the status of an issue (PUT) : - not useable
// exports.updateStatus = catchAsyncErrors(async (req, res) => {
//     const { issueId } = req.params;
//     const result = await Issue.findOne({ _id: issueId }, req.body.status, { new: true });
//     res.send(result);
// });

// add comment to an issue (PUT)
exports.addCommentToIssue = catchAsyncErrors(async (req, res) => {
    const { issueId } = req.params;
    // const comment = Object.keys(req.body)[0];
    const commentInfo = req.body;
    const { commentText, commenter } = commentInfo;

    const result = await Issue.findByIdAndUpdate(
        { _id: issueId },
        {
            $push: {
                comments: {
                    text: commentText,
                    commentedBy: commenter,
                },
            },
        },
        { new: true },
    );
    res.send({
        success: true,
        result,
    });
});

// Delete an issue (DELETE)
exports.deleteAnIssue = catchAsyncErrors(async (req, res) => {
    const { issueId } = req.params;
    const result = await Issue.findByIdAndDelete({ _id: issueId });
    if (result) {
        await new Archive(result.toJSON()).save();
        res.send({ success: true, message: 'Your issue has been deleted' });
    }
});

// Read an archived issue (GET)
exports.getArchive = catchAsyncErrors(async (req, res) => {
    const { issueId } = req.params;
    const result = await Archive.findOne({ _id: issueId });
    res.send({
        success: true,
        result,
    });
});

// Read all archived issues (GET)
exports.getAllArchive = catchAsyncErrors(async (req, res) => {
    const result = await Archive.find({}).sort({ createdAt: -1 });
    res.send({
        success: true,
        result,
    });
});
