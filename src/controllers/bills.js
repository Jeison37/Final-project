const billsModel = require("../models/bills");

const createBill = async (req, res) => {
    try {
        const { id_usuario, id_pago, monto, moneda, estado } = req.body;
        const newBill = await billsModel.create({ id_usuario, id_pago, monto, moneda, estado });
        res.status(201).json(newBill);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};