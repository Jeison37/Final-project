const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      minLength: 3,
    },
    apellido: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    rol: {
      type: Number,
      required: true,
    },
    imagen: {
      type: String,
      default: null,
    },
    direccion: {
      type: String,
      required: true,
    },
    intentosFallidos: {
      type: Number,
      default: 0,
    },
    fechaBloqueo: {
      type: Date,
      default: null,
    },
    premiumFecha: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);

  return await bcrypt.hash(password, salt).then((hash) => hash);
};

UserSchema.statics.comparePassword = async(password, hashPassword)=>{
  return await bcrypt.compare(password, hashPassword);
};

module.exports = mongoose.model("Users", UserSchema);