const process = require('process');
const { Web3Storage, getFilesFromPath } = require('web3.storage');

module.exports.uploadToStorage = async (filePath) => {
  const token = process.env.WEb3_STORAGE_API_KEY;

  if (!token) {
    return console.error('A token is needed. You can create one on https://web3.storage');
  }

  const storage = new Web3Storage({ token });
  const files = [];

  const pathFiles = await getFilesFromPath(filePath);
  files.push(...pathFiles);

  console.log(`Uploading ${files.length} files`)
  const cid = await storage.put(files);
  console.log('Content added with CID:', cid);

  return cid;
}
