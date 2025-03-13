const chatModal = require("../models/chats");

const createChat =  (req, res) =>{
    try{
        const {id_usuario} = req.body;

        const chat = chatModal.create({id_usuario});

        res.status(201).json(chat)
    } catch(error){
        res.status(500).json('error :>> ', error.message);
    }
}

const addTechnician = async (req, res) => {
  try {
    const { id_chat, id_tecnico } = req.body;
    const chat = await chatModal.findByIdAndUpdate(id_chat, { id_tecnico },{ new: true });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatRequests = async (req, res) => {
  try {
    const chats = await chatModal.find({id_tecnico: null});
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createChat, addTechnician, getChatRequests };