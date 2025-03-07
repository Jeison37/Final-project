const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const TicketSchema = new mongoose.Schema(
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
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    estado: {
      type: Number,
      min: 0, 
      max: 2,
      required: true,
      default: 0,
    },
    imagen: {
      type: String,
      default: null,
    },
    visibilidad: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

TicketSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Tickets", TicketSchema);
