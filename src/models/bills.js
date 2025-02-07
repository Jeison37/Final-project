const mongoose = require("mongoose");

const BillSchema = mongoose.Schema({
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", 
        required: true,
    },
    id_pago: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment', 
        required: true,
    },
    monto: {
        type: Number,
        required: true,
    },
    moneda: {
        type: String,
        required: true,
        default: 'USD', 
    },
    estado: {
        type: String,
        enum: ['pendiente', 'pagada', 'cancelada'],
        default: 'pendiente', 
    }
}, { timestamps: true });

module.exports = mongoose.model('Bills', BillSchema);