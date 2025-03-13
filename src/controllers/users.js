const mongoose = require("mongoose");
const userModel = require("../models/users");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');



const getUser = async (req, res) => {
  try {
    const token = req.headers['authorization'];

  const { _id } = jwt.verify(token, process.env.JWT_KEY);
  
  const user = await userModel.findOne({ _id });

  res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {

    const token = req.headers['authorization'];
    const { _id } = jwt.verify(token, process.env.JWT_KEY);
    const { nombre, apellido, email, username, direccion, rol } = req.body;

    let fullUrl = null;

    if (req.file) {
      try {
        fullUrl = `${process.env.BASE_URL}/images/users/profiles/${req.file.filename}`;
      } catch (error) {
        const filePath = path.join(__dirname, `../../images/users/profiles/${req.file.filename}`);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error al eliminar el archivo después del fallo:", err);
          }
        });
        return res.status(500).json({ message: "Error al procesar la imagen", error: error.message });
      }
    }

    // Revisamos si el email y el username ya existen en la base de datos
    const existingUser = await userModel.findOne({
      $and: [
        { _id: { $ne: _id } },
        { $or: [{ username }, { email }] },
      ],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(409).json({ message: "El nombre de usuario ya está en uso" });
      }
      if (existingUser.email === email) {
        return res.status(409).json({ message: "El email ya está en uso" });
      }
    }
    

    // Se actualiza el usuario
    const user = await userModel.findByIdAndUpdate(_id, {
      nombre,
      apellido,
      email,
      username, direccion,
      rol,
      imagen: fullUrl
    },{ new: true });
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

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
  getUser
};
