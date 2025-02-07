const ticketsModel = require("../models/tickets");

const getTickets = async (req, res) => {
    try {
        const tickets = await ticketsModel.find();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await ticketsModel.findById(id);
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTicket = async (req, res) => {
    try {
        const { id_usuario, id_tecnico, titulo, descripcion, estado, imagen, visibilidad } = req.body;
        const ticket = await ticketsModel.create({
            id_usuario,
            titulo,
            descripcion,
            imagen,
            visibilidad,
        });
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_usuario, id_tecnico, titulo, descripcion, estado, imagen, visibilidad } = req.body;
        const ticket = await ticketsModel.findByIdAndUpdate(id, {
            id_usuario,
            id_tecnico,
            titulo,
            descripcion,
            estado,
            imagen,
            visibilidad,
        });
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await ticketsModel.findByIdAndDelete(id);
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
};