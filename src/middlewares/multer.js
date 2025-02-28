const multer = require('multer'); // npm i multer
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, callback)=>{
    const { path } = req.body;
    const dir = path.join(__dirname, `../../images/${path}`);
    fs.mkdirSync(dir, {recursive: true});
    callback(null, dir);
  },
  filename: (req, file, callback)=>{
    callback(null, `${Date.now()}_${file.originalname.replace(/\s/g, "_")}`);
  }
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