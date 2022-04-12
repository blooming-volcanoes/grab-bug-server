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

// Read all issues (GET)
exports.getAllIssues = catchAsyncErrors(async (req, res) => {
    const result = await Issue.find({}).sort({ createdAt: -1 });
    res.send(result);
});

// Update an issue (PUT)
exports.updateAnIssue = catchAsyncErrors(async (req, res) => {
    const { issueId } = req.params;
    const result = await Issue.findByIdAndUpdate({ _id: issueId }, req.body, { new: true });
    res.send(result);
});

// Update the status of an issue (PUT)

// Delete an issue (DELETE)

// Read an archived issue (GET)

// Read all archived issues (GET)
