const multer = require('multer');
const ErrorHandler = require('../lib/errorHandler');
const path = require('path');

const storage = multer.diskStorage({});

const verifyFile = (req, file, cb) => {
    const extensionName = /jpg|png|jpeg|pdf|svg/;
    const checkExtName = extensionName.test(path.extname(file.originalname).toLowerCase());
    const mimeType = extensionName.test(file.mimetype);

    if (checkExtName && mimeType) {
        cb(null, true);
        return;
    }

    cb(new ErrorHandler('Invalid Image type only jpg png jpeg pdf svg'));
};

const upload = multer({ storage, fileFilter: verifyFile, limits: { fileSize: 6000000 } });

module.exports = upload;
