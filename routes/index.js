var express = require('express');
var router = express.Router();
const { FILE_UPLOAD } = require('../helpers/multer-upload');
const web3Storage = require('../services/web3-storage');
const axios = require('axios');
const cors = require('cors');

/** cors option */
let NFTCorsOptions = {
  origin: 'http://127.0.0.1',
  optionsSuccessStatus: 200
};

/* Upload file (NFT Project) */
router.post('/upload', cors(NFTCorsOptions), FILE_UPLOAD.single('file'), async function(req, res, next) {
  try {
    /** upload in local */
    let filePath = process.env.FILE_DIR + req.uploadedFileName
    console.log('Uploaded in local.');

    /** upload to ipfs */
    const cid = await web3Storage.uploadToStorage(filePath, null);
    console.log('Uploaded in ipfs.');

    /** fetch image link */
    let links = await axios.get(`https://dweb.link/api/v0/ls?arg=${cid}`);

    /** check errors */
    if (!links.data)
      throw new Error('data not found.');

    /** get data */
    links = links.data;

    if (!links.Objects || Object.keys(links.Objects).length == 0)
      throw new Error('Objects not found.');
    if (!links.Objects[0].Links || Object.keys(links.Objects[0].Links).length == 0)
      throw new Error('Links not found.');

    /** parameters */
    const gateway_host = 'dweb.link';
    const filename = links.Objects[0].Links[0].Name;
    const image_url = `https://${cid}.ipfs.${gateway_host}/${filename}`;
    const image_url_pattern = 'https://${cid}.ipfs.${gateway_host}/${filename}';

    /** response */
    res.status(200).json({ message: 'Done.', image: { gateway_host, filename, cid, pattern: image_url_pattern, url: image_url } });
  
  } catch (err) {
    res.status(500).json({ message: err.message, image: null });
  }
});

/** upload json metadata (NFT Project) */
router.post('/metadata/upload', cors(NFTCorsOptions), async function(req, res, next) {
  try {
    /** check body data */
    if (!req.body)
      throw new Error('request body not found.');

    /** get */
    const files = await web3Storage.makeFileObjects('sample-name', req.body);

    /** upload to ipfs */
    const cid = await web3Storage.uploadToStorage(null, files);
    console.log('Uploaded in ipfs.');

    /** response */
    res.status(200).json({ message: 'Done.', cid });
  } catch (err) {
    res.status(500).json({ message: err.stack, image: null });
  }
});

module.exports = router;
