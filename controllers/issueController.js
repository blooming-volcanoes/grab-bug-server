const Errorhandler = require('../lib/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Issue = require('../models/Issue');

// create a issue
exports.createIssues = catchAsyncErrors(async (req, res, next) => {
    const issue = req.body;
    const result = await new Issue(issue).save();
    res.send(result);
});
