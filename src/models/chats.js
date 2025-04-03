const mongoose = require("mongoose");

const ChatScheme = mongoose.Schema(
  {
    id_usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    id_tecnico: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
    estado: {
      type: Number,
      min: 0, 
      max: 2,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chats", ChatScheme);