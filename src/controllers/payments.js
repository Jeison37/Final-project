const paymentsModel = require("../models/payments")

const createPayment = async (req, res) => {
    try {
        const { id_usuario, monto, moneda, metodo_pago, estado } = req.body;
        const payment = await paymentsModel.create({
            id_usuario,
            monto,
            moneda,
            metodo_pago,
            estado,
        });
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPayments = async (req, res) => {
    try {
        const payments = await paymentsModel.find();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserPayments = async (req, res) => {
    try {
        const { id } = req.params;
        const payments = await paymentsModel.find({ id_usuario: id });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPayment };