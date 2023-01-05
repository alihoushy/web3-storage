var express = require('express');
var router = express.Router();
const web3Storage = require('../services/web3-storage');
const axios = require('axios');

/* Upload file. */
const { FILE_UPLOAD } = require('../helpers/multer-upload')
router.post('/upload', FILE_UPLOAD.single('file'), async function(req, res, next) {
  try {
    /** upload in local */
    let filePath = process.env.FILE_DIR + req.uploadedFileName
    console.log('Uploaded in local.');

    /** upload to ipfs */
    const cid = await web3Storage.uploadToStorage(filePath);
    console.log('Uploaded in ipfs.');

    /** fetch image link */
    const links = await axios.get(`https://dweb.link/api/v0/ls?arg=${cid}`);
    links = JSON.parse(links);

    /** check errors */
    if (!links['Objects'] || links['Objects'].length == 0)
      throw new Error('Objects not found.');
    if (!links['Objects'][0]['Links'] || links['Objects'][0]['Links'].length == 0)
      throw new Error('Links not found.');

    /** parameters */
    const gateway_host = 'dweb.link';
    const filename = links['Objects'][0]['Links'][0]['Name'];
    const image_url = `https://${cid}.ipfs.${gateway_host}/${filename}`;
    const image_url_pattern = 'https://${cid}.ipfs.${gateway_host}/${filename}';

    /** response */
    res.status(200).json({ message: 'Done.', image: { gateway_host, filename, cid, pattern: image_url_pattern, url: image_url } });
  
  } catch (err) {
    res.status(500).json({ message: err.message, image: null });
  }
});

module.exports = router;
