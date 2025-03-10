const multer = require('multer'); // npm i multer
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const pathname = req.body.pathname; 
    if (pathname) {
      const dir = path.join(__dirname, `../../images/${pathname}`);
      fs.mkdirSync(dir, { recursive: true });
      callback(null, dir);
    } else {
        callback(null, path.join(__dirname, '../../images/'));
    }
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}_${file.originalname.replace(/\s/g, "_")}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, callback)=>{
    if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
      callback(null, true);
    }else{
      callback(null, false);
      return callback(new Error("Solo se permiten los archivos png, jpg y jpeg"));
    }
  }
});

module.exports = { upload };