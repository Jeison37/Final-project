const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema({
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
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Responses", ResponseSchema);