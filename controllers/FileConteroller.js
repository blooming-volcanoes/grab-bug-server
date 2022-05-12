const ErrorHandler = require('../lib/errorHandler');
const File = require('../models/fileModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const cloudinary = require('../lib/cloudinary');

exports.uploadAttachments = catchAsyncErrors(async (req, res, next) => {
    const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: `grabBug/attachments/${req.body.email.trim().toLowerCase()}`,
        resource_type: 'auto',
    });
    if (!upload) {
        next(new Errorhandler('Cloudinary upload failed'));
    }

    const isEmailExists = await File.findOne({ email: req.body.email });

    console.log(req.file);

    if (isEmailExists) {
        const data = {
            fileName: req.file.originalname,
            path: upload.secure_url,
        };
        const result = await File.findOneAndUpdate(
            { email: req.body.email },
            { $push: { attachments: data } },
            { new: true },
        );

        res.status(200).json({
            success: true,
            result,
        });
    } else {
        const data = {
            email: req.body.email,
            name: req.body.name,
            attachments: {
                fileName: req.file.originalname,
                path: upload.secure_url,
            },
        };
        const result = await File.create(data);
        res.status(200).json({
            success: true,
            result,
        });
    }
});

exports.getAllAttachment = catchAsyncErrors(async (req, res, next) => {
    const result = await File.find({}).sort({ updatedAt: -1 });
    res.send(result);
});
