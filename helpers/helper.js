const process = require('process');
const fs = require('fs');

/** upload in local (private function) */
module.exports.uploadInLocal = async (files) => {
     let uploadedFile;
     let uploadPath;

     if (!files || Object.keys(files).length === 0) {
          return res.status(400).send('No files were uploaded.');
     }

     /* The name of the input field (i.e. "nftFile") is used to retrieve the uploaded file */
     uploadedFile = files.nftFile;
     uploadPath = process.env.FILE_DIR + uploadedFile.name;

     /* use the mv() method to place the file somewhere on your server */
     await uploadedFile.mv(uploadPath, function(err) {
          if (err)
               return null;
     });

     return uploadPath;
}
