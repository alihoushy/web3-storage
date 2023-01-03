const multer = require('multer')

/** get file extension */
function getFileExtension(mimetype) {
     switch (mimetype) {
          case 'image/jpeg':
               return '.jpeg';
          case 'image/png':
               return '.png';
          case 'image/gif':
               return '.gif';
          case 'image/svg+xml':
               return '.svg';
          case 'video/mp4':
               return '.mp4';
          case 'audio/webm':
               return '.weba';
          case 'video/webm':
               return '.webm';
          case 'audio/mpeg':
               return '.mpeg';
          case 'audio/wav':
               return '.wav';
          case 'application/ogg':
               return '.ogx';
          case 'audio/ogg':
               return '.oga';
          case 'video/ogg':
               return '.ogv';
          case 'model/gltf+json':
               return '.gltf';
          case 'model/gltf-binary':
               return '.gltf';
          default:
               return '';
     }
}

/** file */
module.exports.FILE_STORAGE = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, process.env.FILE_DIR)
     },
     filename: function (req, file, cb) {
          let fileName = Date.now() + getFileExtension(file.mimetype)
          req.uploadedFileName = fileName
          cb(null, fileName)
     }
})
