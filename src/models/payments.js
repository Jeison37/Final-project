const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    monto: {
        type: Number,
        required: true,
    },
    moneda: {
        type: String,
        required: true,
        default: "USD",
    },
    metodo_pago: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        required: true,
    },
}, {timestamps: true});

module.exports = mongoose.model("Payment", PaymentSchema);
