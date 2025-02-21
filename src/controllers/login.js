const userModel = require("../models/users");

const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.One({ email });
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

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {

        // Mecanismo de bloqueo de usuarios
        if (user.intentos >= 3) user.updateOne({$inc: {intentosFallidos: 1}});
        else {
            user.updateOne({$set: {fechaBloqueo: Date()}});
        }   
            return res.status(401).json({ message: "Credenciales invalidas" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { login };