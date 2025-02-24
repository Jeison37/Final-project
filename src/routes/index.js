const express = require('express');
const router = express.Router();
const fs = require('fs'); // Para interactuar con el sistema de archivos

const pathRouter = `${__dirname}`; // Es una variable global en NodeJs que representa la ruta del directoria actual en la que se encuentrar el archivo

const removeExtension = (filename) =>{
  return filename.split('.').shift(); // Este metodo elimina y devuelve el primer elemento del array. Por ejemplo
  // users.js ['users', 'js'] = ["users"];
};

fs.readdirSync(pathRouter).filter((file)=>{
  // Vamos a leer de forma sincrona el directoria actual y filtrar solo los archivos que termine en .js
  const archivoSinExtension = removeExtension(file);
  const skip = ['index'].includes(archivoSinExtension);
  if(!skip){
    router.use(`/${archivoSinExtension}`, require(`./${archivoSinExtension}`));
  }
});

router.get('*', (req,res)=>{
  res.status(404).json({error: "Ruta no encontrada"});
});

module.exports = router;