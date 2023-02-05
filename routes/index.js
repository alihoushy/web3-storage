var express = require('express');
var router = express.Router();
const web3Storage = require('../services/web3-storage');
const helper = require('../helpers/helper');
const url = require('url');
const path = require('path');
const fs = require('fs');

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
router.post('/upload', async function(req, res, next) {
  try {
    /** upload in local */
    let filePath = await helper.uploadInLocal(req.files);
    if (filePath == null)
      throw new Error('Do not uploaded in local.');

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
    res.status(err.status || 500).json({ message: err.message, stack: err.stack, file: null });
  }
});

/** upload json metadata (NFT Project) */
router.post('/metadata/upload', async function(req, res, next) {
  try {
    /** check body data */
    if (!req.body)
      throw new Error('request body not found.');

    /** make file from json object */
    const files = await web3Storage.makeJsonFile(req.body);
    console.log('Uploaded in local.');

    /** upload to ipfs */
    const cid = await web3Storage.uploadToStorage(null, files);
    console.log('Uploaded in ipfs.');

    /** print logs */
    console.log({ files });

    /** get data from cid */
    const links = await web3Storage.getDataFromCID(cid);

    /** print logs */
    console.log({ links, files });

    /** parameters */
    const filename = links.Objects[0].Links[0].Name;
    const file_url = `https://${cid}.ipfs.${gateway_host[0]}/${filename}`;

    /** response */
    res.status(200).json({ message: 'Done.', file: { gateway_host, filename, cid, pattern: file_url_pattern, url: file_url } });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message, stack: err.stack, file: null });
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
