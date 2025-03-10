const mensajeModal = require("../models/messages");

const createMessage = async (req, res) => {
    try {
        const { id_usuario,  contenido } = req.body;
        const message = await mensajeModal.create({
            id_usuario,
            contenido,
        });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};