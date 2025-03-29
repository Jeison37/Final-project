const likesTicketModel = require("../models/likes-ticket");
const jwt = require("jsonwebtoken");

const getLikes = async (req, res) => {
  try {
    const likes = await likesTicketModel.find();
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { id_ticket } = req.body;
    
    const id_usuario = req.user._id; 

    const existingLike = await likesTicketModel.findOne({
      id_ticket,
      id_usuario,
    });

    if (existingLike) {
      await likesTicketModel.findByIdAndDelete(existingLike._id);
      res.status(200).json({ message: "Dislike realizado" });
    } else {
      const like = await likesTicketModel.create({ id_ticket, id_usuario });
      res.status(201).json(like);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const likeTicket = async (req, res) => {
//     try {
//         const { id_ticket, id_usuario } = req.body;
//         const like = await likesTicketModel.create({ id_ticket, id_usuario });
//         res.status(201).json(like);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const deleteLike = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const like = await likesTicketModel.findByIdAndDelete(id);
//         res.status(200).json(like);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

module.exports = { toggleLike, getLikes };
