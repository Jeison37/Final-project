const mongoose = require("mongoose");

const LikesTicketSchema = new mongoose.Schema({
    id_ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tickets", 
        required: true,
    },
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", 
        required: true,
    }
}, { timestamps: true });

module.exports = moongoose.model("LikesTickets", LikesTicketSchema);