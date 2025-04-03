const { default: mongoose } = require("mongoose");
const billModel = require("../models/bills");
const userModel = require("../models/users");
const constants = require("../utils/constants");

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
    if (req.user.rol === constants.ROL.ADMIN) {
      const id = req.params.id;
      try {
          if (mongoose.isValidObjectId(id)) {
              objectId = mongoose.Types.ObjectId.createFromHexString(id);
          } else {
              return res.status(400).json({ error: "ID inválido" });
          }
      } catch (error) {
          return res.status(400).json({ error: "ID inválido" });
      }
      const user = await userModel.findById(objectId);
      const bill = await billModel.find({id_usuario : objectId});
      res.status(200).json({facturas : bill, email : user.email , name: user.nombre + " " + user.apellido});
      
    } else {
      const bill = await billModel.find({id_usuario : req.user._id});
      res.status(200).json({facturas : bill, email : req.user.email , name: req.user.nombre + " " + req.user.apellido});
      
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
    createBill,
    getBills
}