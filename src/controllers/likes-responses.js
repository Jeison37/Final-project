const ModelLikesResponse = require("../models/likes-response");

const getLikes = async (req, res) => {
    try {
        const likes = await ModelLikesResponse.find();
        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const likeResponse = async (req, res) => {
    try {
        const { id_ticket, id_usuario } = req.body;
        const like = await ModelLikesResponse.create({ id_ticket, id_usuario });
        res.status(201).json(like);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteLike = async (req, res) => {
    try {
        const { id } = req.params;
        const like = await ModelLikesResponse.findByIdAndDelete(id);
        res.status(200).json(like);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { likeResponse, deleteLike, getLikes };