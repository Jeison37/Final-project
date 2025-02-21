const commentModal = require("../models/comments");

const getComments = async (req, res) => {
    try {
        const comments = await commentModal.find();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createComment = async (req, res) => {
    try {
        const { id_ticket, id_usuario, contenido, imagen } = req.body;
        const comment = await commentModal.create({
            id_ticket,
            id_usuario,
            contenido,
            imagen,
        });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_ticket, id_usuario, contenido, imagen } = req.body;
        const comment = await commentModal.findByIdAndUpdate(id, {
            id_ticket,
            id_usuario,
            contenido,
            imagen,
        });
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await commentModal.findByIdAndDelete(id);
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getComments,
    createComment,
    updateComment,
    deleteComment,
};