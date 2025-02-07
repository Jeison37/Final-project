const userModel = require("../models/users");

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
    const { nombre, apellido, email, password, telefono, rol } = req.body;
    const user = await userModel.create({
      nombre,
      apellido,
      email,
      password: await userModel.encryptPassword(password),
      telefono,
      rol,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, password, telefono, rol } = req.body;
    const user = await userModel.findByIdAndUpdate(id, {
      nombre,
      apellido,
      email,
      password: await userModel.encryptPassword(password),
      telefono,
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

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
