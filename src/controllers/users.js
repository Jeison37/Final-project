const userModel = require("../models/users");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {

  try {
    const { nombre, apellido, email, password, username, direccion, rol } = req.body;

    // Se revisa si el username ya existe en la base de datos
    const usernameExists = await userModel.findOne({ username });
    if (usernameExists) {
      return res.status(409).json({ message: "El nombre de usuario ya esta usado" });
    }

    // Se revisa si el email ya existe en la base de datos
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ message: "El email ya esta usado" });
    }

    // Se crea el usuario
    const user = await userModel.create({
      nombre,
      apellido,
      email,
      password: await userModel.encryptPassword(password),
      username, direccion,
      rol,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
        expiresIn: "1d",
    });
    
    res.status(201).json({user, token});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, password, username, direccion, rol } = req.body;

    // Se revisa si el username ya existe en la base de datos
    const usernameExists = await userModel.findOne({ username });
    if (usernameExists) {
      return res.status(409).json({ message: "El nombre de usuario ya esta usado" });
    }

    // Se revisa si el email ya existe en la base de datos
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ message: "El email ya esta usado" });
    }

    // Se actualiza el usuario
    const user = await userModel.findByIdAndUpdate(id, {
      nombre,
      apellido,
      email,
      password: await userModel.encryptPassword(password),
      username, direccion,
      rol,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addProfilePicture = async(req, res)=>{
  const { token } = req.headers;
  const { id } = jwt.verify(token, process.env.JWT_KEY);
  try{
    if(!req.file){
      return  res.status(404).json({message: "No se envio ninguna imagen!"});
    };
    const fullUrl = `${process.env.BASE_URL}/images/users/profiles/${req.file.filename}`;
    //Vamos a guardar la imagen en base de datos
    const user = await userModel.findByIdAndUpdate(id, {
      imagen: fullUrl
    });
    res.status(201).json({message: "Imagen guardada", user});
  }catch(error){
    if(req.file){
      const filePath = path.join(__dirname, `../../images/users/profiles/${req.file.filename}`); // Ruta de la imagen
      fs.unlink(filePath, (error)=>{
        if(error){
          console.error("Error al eliminar el archivo despues del fallo.");
        }
      })
    };
    res.status(500).json({message: "Error al guardar la imagen", error});
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  addProfilePicture
};
