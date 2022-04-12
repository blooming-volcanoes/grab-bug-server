const Errorhandler = require('../lib/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Issue = require('../models/Issue');

// Create an issue (POST)
exports.createIssues = catchAsyncErrors(async (req, res) => {
    const issue = req.body;
    const result = await new Issue(issue).save();
    res.send(result);
});

// Read an issue (GET)
exports.getAnIssue = catchAsyncErrors(async (req, res) => {
    const { issueId } = req.params;
    const result = await Issue.findOne({ _id: issueId });
    console.log(result);
    res.send(result);
});
