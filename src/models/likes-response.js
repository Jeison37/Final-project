const mongoose = require("mongoose");

const LikesResponseSchema = new mongoose.Schema(
  {
    id_respuesta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Responses", 
      required: true,
    },
    id_usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = moongoose.model("LikesResponses", LikesResponseSchema);
