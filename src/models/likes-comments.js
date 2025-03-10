const mongoose = require("mongoose");

const LikesCommentSchema = new mongoose.Schema(
  {
    id_comentario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments", 
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

module.exports = mongoose.model("LikesComments", LikesCommentSchema);
