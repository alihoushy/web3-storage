const multer = require('multer');
const { FILE_STORAGE } = require('./multer-storage');

/** Upload File Filter */
function fileFilter(req, file, cb) {
     const allowedTypes = [
          'image/jpeg', 'image/png', 'image/gif',
          'image/svg+xml', 'video/mp4', 'audio/webm',
          'video/webm', 'audio/mpeg', 'audio/wav',
          'application/ogg', 'audio/ogg', 'video/ogg',
          'model/gltf+json', 'model/gltf-binary'
     ];
     if (!allowedTypes.includes(file.mimetype)) {
          const error = new Error('Incorrect file');
          error.code = 'INCORRECT_FILETYPE';
          return cb(error, false);
     }

     cb(null, true);
}

/** upload excel */
module.exports.FILE_UPLOAD = multer({
     storage: FILE_STORAGE,
     fileFilter,
     limits: {
          // max filesize: 100(Mb)
          fileSize: 100000000
     }
})
