const ModelLikesTicket = require("../models/likes-ticket");
const jwt = require("jsonwebtoken");

const getLikes = async (req, res) => {
  try {
    const likes = await ModelLikesTicket.find();
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { id_ticket } = req.body;
    const token = req.headers["authorization"];
    const { _id } = jwt.verify(token, process.env.JWT_KEY);
    const id_usuario = _id;

    const existingLike = await ModelLikesTicket.findOne({
      id_ticket,
      id_usuario,
    });

    if (existingLike) {
      await ModelLikesTicket.findByIdAndDelete(existingLike._id);
      res.status(200).json({ message: "Dislike realizado" });
    } else {
      const like = await ModelLikesTicket.create({ id_ticket, id_usuario });
      res.status(201).json(like);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const likeTicket = async (req, res) => {
//     try {
//         const { id_ticket, id_usuario } = req.body;
//         const like = await ModelLikesTicket.create({ id_ticket, id_usuario });
//         res.status(201).json(like);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const deleteLike = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const like = await ModelLikesTicket.findByIdAndDelete(id);
//         res.status(200).json(like);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

module.exports = { toggleLike, getLikes };
