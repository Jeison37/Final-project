const mongoose = require("mongoose");
const ticketsModel = require("../models/tickets");
const jwt = require('jsonwebtoken');
const Comment = require("../models/comments");
const likeTicket = require("../models/likes-ticket");

const assignTechnician = async (req, res) => {
    try {
        const { id_ticket} = req.body;
        const token = req.headers['authorization'];
        const { _id } = jwt.verify(token, process.env.JWT_KEY);
        const ticket = await ticketsModel.findByIdAndUpdate(id_ticket, { id_tecnico : _id });
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const changeStatus = async (req, res) => {
    try {
        const { id_ticket, estado } = req.body;
        const ticket = await ticketsModel.findByIdAndUpdate(id_ticket, { estado });
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getAllTicketData = async (req, res) => {
    try {
        const token = req.headers['authorization'];
        const { _id } = jwt.verify(token, process.env.JWT_KEY);

        const { page = 1, limit = 5 } = req.body;

        // Establecemos las opciones para la paginacion, y el populate para obtener los datos de los usuarios
        const options = {
            page, 
            limit, 
            populate: [
              { path: 'id_usuario', select: 'nombre apellido username email imagen' },
              { path: 'id_tecnico', select: 'nombre apellido username email imagen' },
            ],
          };

          const result = await ticketsModel.paginate({}, options);

          // Obtenemos el numero de likes y comentarios para cada ticket y se lo asignamos a cada ticket
          const ticketsWithCounts = await Promise.all(
            result.docs.map(async ticket => {
              const likesCount = await likeTicket.countDocuments({ id_ticket: ticket._id });
              const commentsCount = await Comment.countDocuments({ id_ticket: ticket._id });
              const userLiked = await likeTicket.findOne({ id_ticket: ticket._id, id_usuario: _id });
              
              return {
                ...ticket.toObject(),
                likesCount,
                commentsCount,
                userLiked: !!userLiked,
              };
            })
          );

          res.status(200).json({
            ...result,
            docs: ticketsWithCounts,
          });

        // const options = {
        //   page: page,
        //   limit: 2
        // }
        // ticketsModel.paginate({},options, (err, docs) =>{
        //   res.send({
        //     items: docs
        //   })
        // })

        // const tickets = await ticketsModel.find()
        // .populate('id_usuario', 'nombre apellido username email imagen') 
        // .populate('id_tecnico', 'nombre apellido username email imagen'); 

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTickets = async (req, res) => {
    try {
        const tickets = await ticketsModel.find();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTicket = async (req, res) => {
    try {
        const { id } = req.params; 
        
        let objectId;   
        
        // Verificamos si el id es valido
        try {
            if (mongoose.isValidObjectId(id)) {
                objectId = mongoose.Types.ObjectId.createFromHexString(id);
            } else {
                return res.status(400).json({ error: "ID inválido" });
            }
        } catch (error) {
            return res.status(400).json({ error: "ID inválido" });
        }
        
        const [ticket] = await ticketsModel.aggregate([
            { $match: { _id: objectId } },
            {
                $lookup: {
                    from: "likes_tickets",
                    localField: "_id",
                    foreignField: "id_ticket",
                    as: "likes",
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "id_ticket",
                    as: "commentarios",
                },
            },
            {
                $lookup: {
                    from: "users", // Colección de usuarios
                    localField: "id_usuario",
                    foreignField: "_id",
                    as: "informante",
                },
            },
            {
                $unwind: {
                    path: "$usuario",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "users", // Colección de usuarios
                    localField: "id_tecnico",
                    foreignField: "_id",
                    as: "tecnico",
                },
            },
            {
                $unwind: {
                    path: "$tecnico",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);

        if (ticket.length === 0) {
            return res.status(404).json({ error: "Ticket no encontrado" });
        }

        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createTicket = async (req, res) => {
    try {
        const { titulo, descripcion, imagen, visibilidad } = req.body;
        const token = req.headers['authorization'];
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const ticket = await ticketsModel.create({
            id_usuario: decoded._id,
            titulo,
            descripcion,
            imagen,
            visibilidad,
        });
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTicket = async (req, res) => {
    try {
        const { id_tecnico, titulo, descripcion, estado, imagen, visibilidad } = req.body;
        const token = req.headers['authorization'];
        const { _id } = jwt.verify(token, process.env.JWT_KEY);

        const ticket = await ticketsModel.findByIdAndUpdate(_id, {
            id_tecnico,
            titulo,
            descripcion,
            estado,
            visibilidad,
        });
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await ticketsModel.findByIdAndDelete(id);
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllTicketData,
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    changeStatus,
    assignTechnician
};