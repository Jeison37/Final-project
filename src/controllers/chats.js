const chatModal = require("../models/chats");

const createChat = async (req, res) =>{
    try{
        const id_usuario = req.user._id;

        const chat = await chatModal.create({id_usuario});
      console.log('chat :>> ', chat);
        res.status(201).json(chat)
    } catch(error){
        res.status(500).json({error: error.message});
    }
}

const getChat = async (req, res) => {
  try {
    const { id } = req.params; 
    const chat = await chatModal.findById(id)
    .populate('id_tecnico', 'nombre apellido username email imagen')
    .populate('id_usuario', 'nombre apellido username email imagen');
    res.status(200).json({chat, idu : req.user._id});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const addTechnician = async (req, res) => {
  try {
    const { id_chat } = req.body;
    const _id = req.user._id;
    const chat = await chatModal.findByIdAndUpdate(id_chat, { id_tecnico : _id },{ new: true });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatRequests = async (req, res) => {
  try {
    const chats = await chatModal.find({id_tecnico: null}).populate('id_usuario', 'nombre apellido username email imagen');
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const deleteChat = async (req,res) => {
  try {
    const { id } = req.body;
    const chat = await chatModal.findByIdAndDelete(id);
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createChat, addTechnician, getChatRequests, deleteChat, getChat };