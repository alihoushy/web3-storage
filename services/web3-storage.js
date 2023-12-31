const process = require('process');
const { Web3Storage, getFilesFromPath } = require('web3.storage');
const axios = require('axios');
const fs = require('fs');

/** upload files */
module.exports.uploadToStorage = async (filePath, files) => {
  const token = process.env.WEb3_STORAGE_API_KEY;

  if (!token) {
    throw new Error('A token is needed. You can create one on https://web3.storage');
  }

  const storage = new Web3Storage({ token });
  let _files = [];

  /** check filePath & files */
  if (filePath != null) {
    const pathFiles = await getFilesFromPath(filePath);
    _files.push(...pathFiles);
  } else if (files != null) {
    _files = files;
  } else {
    return null;
  }

  /** Upload file */
  console.log(`Uploading ${_files.length} files`);
  const cid = await storage.put(_files);
  console.log('Content added with CID:', cid);

  return cid;
}

/** make file from json object */
module.exports.makeJsonFile = async (obj) => {
  /** parameters */
  let files = [];
  let filePath = process.env.FILE_DIR + (Math.random()).toString(36).substring(2) + '-metadata.json';

  /** upload file */
  console.log(`Uploading json metadata file`);
  await this.createFileFromString(filePath, Buffer.from(JSON.stringify(obj)));

  /** push to files array */
  const pathFiles = await getFilesFromPath(filePath);
  files.push(...pathFiles);

  return files;
}

/** create file from string */
module.exports.createFileFromString = async (fileName, fileContent) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, fileContent, 'utf8', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

/** get data from cid */
module.exports.getDataFromCID = async (cid) => {
  /** fetch image link */
  let links = await axios.get(`https://dweb.link/api/v0/ls?arg=${cid}`);

  /** check errors */
  if (!links.data)
    throw new Error('data not found.');

  /** get data */
  links = links.data;

  /** check errors */
  if (!links.Objects || Object.keys(links.Objects).length == 0)
    throw new Error('Objects not found.');
  if (!links.Objects[0].Links || Object.keys(links.Objects[0].Links).length == 0)
    throw new Error('Links not found.');

  return links;
}
