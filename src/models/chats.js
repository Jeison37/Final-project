const mongoose = require("mongoose");

const ChatScheme = mongoose.Schema(
  {
    id_usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    id_tecnico: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

modele.exports = mongoose.model("Chats", ChatScheme);
