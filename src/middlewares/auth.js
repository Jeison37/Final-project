const jwt = require('jsonwebtoken');
const userModel = require('../models/users');

const auth = roles => async(req, res, next)=>{
  const token = req.headers['authorization'];
  // console.log(token);
  try{
    if(!token){
      return res.status(404).json({message: "Token no enviado"});
    };

    if (!jwt.decode(token)) {
      return res.status(401).json({ message: "Token invalido" });
    }

    const { _id } = jwt.verify(token, process.env.JWT_KEY);
    // console.log(decoded);
    const userFind = await userModel.findById({ _id });
    if(!userFind){
      return res.status(404).json({message: "El usuario no existe"});
    };
    if (roles.includes(userFind.rol) || roles.length == 0){
      next();
    } else {
        res.status(409).json({error: "No tienes permisos"});
    }
  }catch(error){
    return res.status(500).json({error:"Error de autorizacion: " +  error.message});
  }
};

module.exports = { auth };