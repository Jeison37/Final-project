const userModel = require("../models/users");

const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Attempting login for email: ${email}`);
        
        const user = await userModel.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        // Se verifica si el usuario está bloqueado
        if (user.fechaBloqueo){

            const currentTime = Date.now();
            const unblockTime = user.fechaBloqueo.getTime() + 10 * 1000;

            // Se verifica si ya pasaron los 5 minutos desde que se bloqueo
            if (currentTime > unblockTime){
                await user.updateOne({$set: {intentosFallidos: 0, fechaBloqueo: null}});
            } else{
                return res.status(401).json({ message: "Usuario bloqueado, espera 5 minutos" });
                
            }
        }

        // console.log('userModel.comparePassword JWT_KEY', userModel.comparePassword);
        const isMatch = await userModel.comparePassword(password, user.password);
        if (!isMatch) {
            // Mecanismo de bloqueo de usuarios

        if (user.intentosFallidos <= 3) {
            await user.updateOne({$inc: {intentosFallidos: 1}});
            console.log("Dentro del mecanismo", user.intentosFallidos);
        }
        else {
            await user.updateOne({$set: {fechaBloqueo: Date.now(), intentosFallidos: 0}});
        }   
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ _id: user._id, rol: user.rol }, process.env.JWT_KEY, {
            expiresIn: "1y",
        });
        
        console.log("Login successful, generating token");

        res.status(200).json({ token , imagen: user.imagen, rol: user.rol});
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { login };