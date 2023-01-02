const multer = require('multer')
const { FILE_STORAGE } = require('./multer-storage')

/** Upload File Filter */
function fileFilter(req, file, cb) {
     const allowedTypes = [ 'image/jpeg', 'image/jpg', 'image/png' ]
     if (!allowedTypes.includes(file.mimetype)) {
          const error = new Error('Incorrect file')
          error.code = 'INCORRECT_FILETYPE'
          return cb(error, false)
     }

     cb(null, true)
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
