var express = require('express');
var router = express.Router();
const web3Storage = require('../services/web3-storage');

/* Upload file. */
const { FILE_UPLOAD } = require('../helpers/multer-upload')
router.post('/upload', FILE_UPLOAD.single('file'), async function(req, res, next) {
  try {
    let filePath = process.env.FILE_DIR + req.uploadedFileName
    console.log(filePath + ' uploaded in local!');
    const cid = await web3Storage.uploadToStorage(filePath);
    console.log(filePath + ' uploaded in web3!');
    res.json({ cid, message: 'Done!' });
  } catch (err) {
    res.status(500).json({ err })
  }
});

module.exports = router;
