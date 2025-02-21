const imageModel = require('../models/images');
const fs = require('fs');
const path = require('path');

const createImage = async(req, res)=>{
  try{
    if(!req.file){
      return  res.status(404).json({message: "No se envio ninguna imagen"});
    };
    const fullUrl = `${process.env.BASE_URL}/images/${req.file.filename}`;
    //Vamos a guardar la imagen en base de datos
    const image = await imageModel.create({image: fullUrl});
    res.status(201).json({message: "Imagen guardada", image});
  }catch(error){
    if(req.file){
      const filePath = path.join(__dirname, `../../images/${req.file.filename}`); // Ruta de la imagen
      fs.unlink(filePath, (error)=>{
        if(error){
          console.error("Error al eliminar el archivo despues del fallo.");
        }
      })
    };
    res.status(500).json({message: "Error al guardar la imagen", error});
  }
};

module.exports = {getImages, createImage};