const jwt = require('jsonwebtoken');
const userModel = require('../models/users');
const { ROL } = require('../utils/constants');

const premium = () => async(req, res, next)=>{
  const _id = req.user._id;
  // console.log("Premium middleware");
  try{

    // console.log('Find user by id:', _id);
    const userFind = await userModel.findById({ _id });

    // console.log('User find:', userFind);
    if (userFind.rol == ROL.TECHNICIAN || userFind.premiumFecha) {
        // console.log('User has premium:', userFind.premiumFecha > Date.now());
        if (Date.now() > userFind.premiumFecha && userFind.rol == ROL.USER) {
            // console.log('Premium has expired');
            return res.status(409).json({ error: "Ya venció tu plan" });
        }
      // console.log('Next');
      next();
    } else {
        // console.log('No tiene permiso');
        res.status(409).json({error: "No tienes permisos"});
    }
  }catch(error){
    console.error('Error de autorizacion:', error);
    return res.status(500).json({error:"Error de autorizacion: " +  error.message});
  }
};

module.exports = { premium };