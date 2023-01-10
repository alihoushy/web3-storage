const process = require('process');
const { Web3Storage, getFilesFromPath } = require('web3.storage');
const { Blob, File } = require('buffer');

/** upload files */
module.exports.uploadToStorage = async (filePath, files) => {
  const token = process.env.WEb3_STORAGE_API_KEY;

  if (!token) {
    return console.error('A token is needed. You can create one on https://web3.storage');
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

  console.log(`Uploading ${_files.length} files`)
  const cid = await storage.put(_files);
  console.log('Content added with CID:', cid);

  return cid;
}

/** make file from json object */
module.exports.makeFileObjects = (name, obj) => {
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });

  const files = [
    new File(['contents-of-file-1'], 'plain-utf8.txt'),
    new File([blob], name + '.json')
  ];

  return files;
}
