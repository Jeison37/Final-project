const mongoose = require("mongoose");
const userModel = require("../models/users");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');



const getUser = async (req, res) => {
  try {
    
    const user = req.user;
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
    console.log("Starting updateUser function");
    const _id = req.user._id;
    console.log(`User ID from request: ${_id}`);

    const { nombre, apellido, email, username, direccion, rol } = req.body;
    console.log("Request body:", { nombre, apellido, email, username, direccion, rol });

    let fullUrl = null;

    console.log('req.file :>> ', req.file);

    if (req.file) {
      try {
        fullUrl = `${process.env.BASE_URL}/images/users/profiles/${req.file.filename}`;
        console.log(`Image uploaded, URL: ${fullUrl}`);
      } catch (error) {
        const filePath = path.join(__dirname, `../../images/users/profiles/${req.file.filename}`);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error al eliminar el archivo después del fallo:", err);
          }
        });
        console.error("Error processing image:", error.message);
        return res.status(500).json({ message: "Error al procesar la imagen", error: error.message });
      }
    }

    console.log("Checking for existing user with email or username");
    const existingUser = await userModel.findOne({
      $and: [
        { _id: { $ne: _id } },
        { $or: [{ username }, { email }] },
      ],
    });

    if (existingUser) {
      console.log("Existing user found:", existingUser);
      if (existingUser.username === username) {
        console.log("Username already in use");
        return res.status(409).json({ message: "El nombre de usuario ya está en uso" });
      }
      if (existingUser.email === email) {
        console.log("Email already in use");
        return res.status(409).json({ message: "El email ya está en uso" });
      }
    }

    console.log("Updating user information in the database");
    const user = await userModel.findByIdAndUpdate(_id, {
      nombre,
      apellido,
      email,
      username,
      direccion,
      rol,
      imagen: fullUrl
    }, { new: true });
    console.log("User updated successfully:", user);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in updateUser function:", error.message);
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
