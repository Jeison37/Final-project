const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    id_ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tickets', 
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
    }
}, { timestamps: true });

module.exports = mongoose.model("Comments", CommentSchema);