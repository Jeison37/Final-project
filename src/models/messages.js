const mongoose = require("mongoose");

const MessageModal = mongoose.Schema(
  {
    id_chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chats", 
      required: true,
    },
    id_usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    contenido: {
      type: String,
      required: true,
    },
    imagen: {
      type: String,
      default: null
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Messages", MessageModal);
