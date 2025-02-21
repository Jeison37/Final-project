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
      type: String,
      required: true,
    },
    imagen: {
      type: String,
      required: true,
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