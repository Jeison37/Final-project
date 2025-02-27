const express = require('express');
const router = express.Router();

const { upload } = require('../middleware/multer'); 
const { getImages, createImage} = require('../controllers/images');
// Ruta para obtener imagenes
router.get('/', getImages);

// Ruta para subir imagenes
router.post('/', (req, res, next)=>{
  upload.single("imagen")(req,res, next);
}, createImage);

module.exports = router;