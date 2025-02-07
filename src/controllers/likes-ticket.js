const ModelLikesTicket = require("../models/likes-ticket");

const getLikes = async (req, res) => {
    try {
        const likes = await ModelLikesTicket.find();
        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const likeTicket = async (req, res) => {
    try {
        const { id_ticket, id_usuario } = req.body;
        const like = await ModelLikesTicket.create({ id_ticket, id_usuario });
        res.status(201).json(like);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteLike = async (req, res) => {
    try {
        const { id } = req.params;
        const like = await ModelLikesTicket.findByIdAndDelete(id);
        res.status(200).json(like);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { likeTicket, deleteLike, getLikes };