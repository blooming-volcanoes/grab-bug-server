const Errorhandler = require('../lib/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.createIssue = catchAsyncErrors(async (req, res, next) => {});
