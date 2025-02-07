const mongoose = require("mongoose");

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
    telefono: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      required: true,
    },
    imagen: {
      type: String,
      required: true,
    },
    estado: {
      type: Boolean,
      default: false,
    },
    direccion: {
      type: String,
      required: true,
    },
    pais: {
      type: String,
      required: true,
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

module.exports = mongoose.model("Users", UserSchema);