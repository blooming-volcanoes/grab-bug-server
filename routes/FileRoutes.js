const router = require('express').Router();
const upload = require('../lib/multer');
const { uploadAttachments, getAllAttachment } = require('../controllers/FileConteroller');

router.get('/files', getAllAttachment);
router.post('/files/attachments', upload.single('file'), uploadAttachments);

module.exports = router;
