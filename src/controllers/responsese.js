const responseModal = require("../models/responses");

const getResponses = async (req, res) => {
    try {
        const responses = await responseModal.find();
        res.status(200).json(responses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createResponse = async (req, res) => {
    try {
        const { id_ticket, id_usuario, contenido, imagen } = req.body;
        const response = await responseModal.create({
            id_ticket,
            id_usuario,
            contenido,
            imagen,
        });
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_ticket, id_usuario, contenido, imagen } = req.body;
        const response = await responseModal.findByIdAndUpdate(id, {
            id_ticket,
            id_usuario,
            contenido,
            imagen,
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await responseModal.findByIdAndDelete(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getResponses,
    createResponse,
    updateResponse,
    deleteResponse,
};