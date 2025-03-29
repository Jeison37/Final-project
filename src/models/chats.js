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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chats", ChatScheme);