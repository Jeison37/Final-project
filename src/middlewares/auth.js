const jwt = require('jsonwebtoken');
const userModel = require('../models/users');

const auth = roles => async(req, res, next)=>{
  const token = req.headers['authorization'];
  console.log(token);
  if(!token){
    return res.status(404).json({message: "Token no enviado"});
  };

  try{
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    const userFind = await userModel.findById(decoded.id);
    if(!userFind){
      return res.status(404).json({message: "El usuario no existe"});
    };
    if (roles.includes(userFind.rol) || roles.length == 0){
      next();
    } else {
        res.status(409).json({error: "No tienes permisos"});
        // res.send({error: "No tienes permisos"})
    }
  }catch(error){
    return res.status(500).json({error: error.message});
  }
};

module.exports = { auth };