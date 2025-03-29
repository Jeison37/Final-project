const billModel = require("../models/bills");

const createBill = async (req, res) => {
    try {
        const { id_usuario, id_pago, monto, moneda, estado } = req.body;
        const newBill = await billModel.create({ id_usuario, id_pago, monto, moneda, estado });
        res.status(201).json(newBill);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

const getBills = async (req, res) => {
  try {
    const bill = await billModel.find({id_usuario : req.user._id});
    res.status(200).json({facturas : bill, email : req.user.email , name: req.user.nombre + " " + req.user.apellido});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
    createBill,
    getBills
}