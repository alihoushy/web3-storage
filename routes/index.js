var express = require('express');
var router = express.Router();
const { FILE_UPLOAD } = require('../helpers/multer-upload');
const web3Storage = require('../services/web3-storage');
const moralis = require('../services/moralis');
const url = require('url');
const path = require('path');
const fs = require('fs');
// const cors = require('cors');

/** cors option */
// let NFTCorsOptions = {
//   origin: 'http://127.0.0.1',
//   optionsSuccessStatus: 200
// };
const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': true
};
const gateway_host = [ 'dweb.link', 'w3s.link' ];
const file_url_pattern = 'https://${cid}.ipfs.${gateway_host}/${filename}';
const allowedTypes = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  mp4: 'video/mp4',
  webm: 'audio/webm',
  webm: 'video/webm',
  mpeg: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'application/ogg',
  ogg: 'audio/ogg',
  ogg: 'video/ogg',
  gltf: 'model/gltf+json',
  gltf: 'model/gltf-binary',
  json: 'application/json'
};

/* Upload file (NFT Project) */
router.post('/upload', FILE_UPLOAD.single('file'), async function(req, res, next) {
  try {
    /** upload in local */
    let filePath = process.env.FILE_DIR + req.uploadedFileName;
    const lastIndex = filePath.lastIndexOf('/');
    const fileName = filePath.substring(lastIndex + 1);
    console.log('Uploaded in local.');

    /** upload to ipfs */
    // const cid = await web3Storage.uploadToStorage(filePath, null);
    // console.log('Uploaded in ipfs.');

    /** get data from cid */
    // const links = await web3Storage.getDataFromCID(cid);

    /** parameters */
    // const filename = links.Objects[0].Links[0].Name;
    // const file_url = `https://${cid}.ipfs.${gateway_host[0]}/${filename}`;
    const url = process.env.BASE_URL + process.env.DOWNLOAD_URL + fileName;

    /** response */
    // res.set(headers).status(200).json({ message: 'Done.', file: { gateway_host, filename, cid, pattern: file_url_pattern, url: file_url } });
    res.set(headers).status(200).json({ file: url })
  
  } catch (err) {
    res.set(headers).status(err.status || 500).json({ message: err.message, stack: err.stack, file: null });
  }
});

/** upload json metadata (NFT Project) */
router.post('/metadata/upload', async function(req, res, next) {
  try {
    /** check body data */
    if (!req.body)
      throw new Error('request body not found.');

    /** make file from json object */
    // const files = await web3Storage.makeJsonFile(req.body);
    const filePath = await web3Storage.makeJsonFile(req.body);
    const lastIndex = filePath.lastIndexOf('/');
    const fileName = filePath.substring(lastIndex + 1);
    console.log('Uploaded in local.');

    /** upload to ipfs */
    // const cid = await web3Storage.uploadToStorage(null, files);
    // console.log('Uploaded in ipfs.');

    /** get data from cid */
    // const links = await web3Storage.getDataFromCID(cid);

    /** parameters */
    // const filename = links.Objects[0].Links[0].Name;
    // const file_url = `https://${cid}.ipfs.${gateway_host[0]}/${filename}`;
    const url = process.env.BASE_URL + process.env.DOWNLOAD_URL + fileName;

    /** response */
    // res.set(headers).status(200).json({ message: 'Done.', file: { gateway_host, filename, cid, pattern: file_url_pattern, url: file_url } });
    res.set(headers).status(200).json({ file: url })
  } catch (err) {
    res.set(headers).setheade.status(err.status || 500).json({ message: err.message, stack: err.stack, file: null });
  }
});

/**‌ preview file in browser */
router.get('/download/*', function(req, res) {
  const q = url.parse(req.url, true);
  let pathName = q.pathname;
  const lastIndex = pathName.lastIndexOf('/');
  const fileName = pathName.substring(lastIndex + 1);
  const file = process.env.DOWNLOAD_DIR + fileName;

  let type = allowedTypes[path.extname(file).slice(1)] || 'text/plain';
  let s = fs.createReadStream(file);
  s.on('open', function () {
      res.setHeader('Content-Type', type);
      s.pipe(res);
  });
  s.on('error', function () {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 404;
      res.end('Not found');
  });
});

module.exports = router;
