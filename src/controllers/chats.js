const chatsModal = require("../models/chat");

const createChat =  (req, res) =>{
    try{
        const {id_usuario, id_tecnico} = req.body;

        const chat = chatsModal.create({id_usuario,id_tecnico});

        res.status(201).json(chat)
    } catch(error){
        res.status(500).json('error :>> ', error.message);
    }
}


