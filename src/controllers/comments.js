const commentModal = require("../models/comments");
const jwt = require('jsonwebtoken');

const getComments = async (req, res) => {
    console.log('getComments');
    try {
        // const comments = await commentModal.find();
        res.status(200).json(comments);
    } catch (error) {
        console.log('error :>> ', error);
        res.status(500).json({ message: error.message, a : commentModal.countDocuments() });
    }
};

const createComment = async (req, res) => {
    try {
        const { id_ticket, contenido, imagen = null } = req.body;
        const token = req.headers['authorization'];
        const { _id } = jwt.verify(token, process.env.JWT_KEY);
        const comment = await commentModal.create({
            id_ticket,
            id_usuario : _id,
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