const likesCommentModel = require("../models/likes-comment");

const getLikes = async (req, res) => {
    try {
        const likes = await likesCommentModel.find();
        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const likeComment = async (req, res) => {
    try {
        const { id_ticket, id_usuario } = req.body;
        const like = await likesCommentModel.create({ id_ticket, id_usuario });
        res.status(201).json(like);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteLike = async (req, res) => {
    try {
        const { id } = req.params;
        const like = await likesCommentModel.findByIdAndDelete(id);
        res.status(200).json(like);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { likeComment, deleteLike, getLikes };