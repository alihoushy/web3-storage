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
const gateway_host = [ 'dweb.link', 'w3s.link' ];
const file_url_pattern = 'https://${cid}.ipfs.${gateway_host}/${filename}';

/* Upload file (NFT Project) */
router.post('/upload', cors(NFTCorsOptions), FILE_UPLOAD.single('file'), async function(req, res, next) {
  try {
    /** upload in local */
    let filePath = process.env.FILE_DIR + req.uploadedFileName
    console.log('Uploaded in local.');

    /** upload to ipfs */
    const cid = await web3Storage.uploadToStorage(filePath, null);
    console.log('Uploaded in ipfs.');

    /** get data from cid */
    const links = await web3Storage.getDataFromCID(cid);

    /** parameters */
    const filename = links.Objects[0].Links[0].Name;
    const file_url = `https://${cid}.ipfs.${gateway_host[0]}/${filename}`;

    /** response */
    res.status(200).json({ message: 'Done.', file: { gateway_host, filename, cid, pattern: file_url_pattern, url: file_url } });
  
  } catch (err) {
    res.status(500).json({ message: err.message, file: null });
  }
});

/** upload json metadata (NFT Project) */
router.post('/metadata/upload', cors(NFTCorsOptions), async function(req, res, next) {
  try {
    /** check body data */
    if (!req.body)
      throw new Error('request body not found.');

    /** make file from json object */
    const files = await web3Storage.makeJsonFile(req.body);

    /** upload to ipfs */
    const cid = await web3Storage.uploadToStorage(null, files);
    console.log('Uploaded in ipfs.');

    /** get data from cid */
    const links = await web3Storage.getDataFromCID(cid);

    /** parameters */
    const filename = links.Objects[0].Links[0].Name;
    const file_url = `https://${cid}.ipfs.${gateway_host[0]}/${filename}`;

    /** response */
    res.status(200).json({ message: 'Done.', file: { gateway_host, filename, cid, pattern: file_url_pattern, url: file_url } });
  } catch (err) {
    res.status(500).json({ message: err.stack, file: null });
  }
});

module.exports = router;
