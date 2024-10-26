const express = require('express');
const multer = require('multer');
const { uploadEmails, dispatchEmails } = require('../controller/emailController');

const router = express.Router();
const upload = multer({ dest: 'uploads/emailCsv/' });

router.post('/upload',upload.single('file'), uploadEmails);
router.post('/dispatch', dispatchEmails);

module.exports = router;
