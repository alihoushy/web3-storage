const multer = require('multer')

/** get file extension */
function getFileExtension(mimetype) {
     if (mimetype == 'image/jpeg')
          return '.jpeg'
     else if (mimetype == 'image/jpg')
          return '.jpg'
     else if (mimetype == 'image/png')
          return '.png'
     else
          return ''
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
