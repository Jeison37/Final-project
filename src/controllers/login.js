const userModel = require("../models/users");

const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // Se verifica si el usuario está bloqueado
        if (user.fechaBloqueo){

            // Se verifica si ya pasaron los 5 minutos desde que se bloqueo
            if (Date() > user.fechaBloqueo + 300){
                user.updateOne({$set: {intentosFallidos: 0, fechaBloqueo: null}});
            } else{

                return res.status(401).json({ message: "Usuario bloqueado, espera 5 minutos" });
                
            }
        }
        // console.log('userModel.comparePassword JWT_KEY', userModel.comparePassword);
        const isMatch = await userModel.comparePassword(password, user.password);
        if (!isMatch) {
            console.log("Antes del mecanismo")
        // Mecanismo de bloqueo de usuarios
        if (user.intentosFallidos <= 3) {
            user.updateOne({$inc: {intentosFallidos: 1}});
            console.log("Dentro del mecanismo")
        }
        else {
            user.updateOne({$set: {fechaBloqueo: Date()}});
        }   
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
            expiresIn: "1d",
        });
        res.status(200).json({ token , imagen: user.imagen, rol: user.rol});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { login };