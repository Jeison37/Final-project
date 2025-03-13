const mongoose = require("mongoose");
const ticketModel = require("../models/tickets");
const userModel = require("../models/users");
const likesTicketModel = require("../models/likes-ticket");
const jwt = require('jsonwebtoken');
const Comment = require("../models/comments");
const likeTicket = require("../models/likes-ticket");
const { STATUS, ROL } = require("../utils/constants");

const getTicketsCounts = async (req, res) => {
    const token = req.headers['authorization'];
    const { _id } = jwt.verify(token, process.env.JWT_KEY);
    try {
        if (mongoose.isValidObjectId(_id)) {
            objectId = mongoose.Types.ObjectId.createFromHexString(_id);
        } else {
            return res.status(400).json({ error: "ID inválido" });
        }
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(400).json({ error: "ID inválido" });
    }

    try {
        const all = await ticketModel.countDocuments({ id_tecnico: objectId });
        const pending = await ticketModel.countDocuments({ estado: STATUS.PENDING, id_tecnico: objectId });
        const completed = await ticketModel.countDocuments({ estado: STATUS.COMPLETED, id_tecnico: objectId });
        const count = { all, pending, completed };
        // console.log('count :>> ', count);
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getTechniciansCounts = async (req, res) => {
    try {
        // const technicianList = await ticketModel.aggregate([
        //     {
        //         $match: {estado: 1, id_tecnico: {$ne: null} }
        //     },
        //     {
        //         $group: {
        //             _id: "$id_tecnico",
        //             total: { $sum: 1}
        //         },
                 
        //     },
        //      {
        //         $lookup: {  
        //             from: "users",  
        //             localField: "_id",  
        //             foreignField: "_id",  
        //             as: "tecnico"  
        //         },
        //     },
        //     {
        //         $unwind: "$tecnico"  
        //     },
        //     {
        //         $sort: {total: -1}
        //     },
        
        // ]);
        const technicianCount = await userModel.countDocuments({ rol: ROL.TECHNICIAN });

        const technicians = await userModel.find({rol: ROL.TECHNICIAN});

        const technicianList = await Promise.all(
            technicians.map( async technician =>{

                const total = await ticketModel.countDocuments({ id_tecnico: technician._id})

                return {
                    total,
                    ...technician.toObject()
                }
            })
        )

        technicianList.sort( (a,b) => b.total - a.total )

        const bestTechnician = technicianList[0];

        const worstTechnician = technicianList[technicianList.length - 1];


        res.status(200).json({ technicianList, technicianCount, bestTechnician, worstTechnician });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const assignTechnician = async (req, res) => {
    try {
        const { id_ticket} = req.body;
        const token = req.headers['authorization'];
        const { _id } = jwt.verify(token, process.env.JWT_KEY);
        const ticket = await ticketModel.findByIdAndUpdate(id_ticket, { id_tecnico : _id });
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const changeStatus = async (req, res) => {
    try {
        const { id_ticket, estado } = req.body;
        // console.log('estado :>> ', estado);
        const ticket = await ticketModel.findByIdAndUpdate(id_ticket, { estado });
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getAllTicketData = async (req, res, status) => {
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

          let query = {};
          
          if (status !== undefined) {
            // console.log('status :>> ', status);
            try {
                if (mongoose.isValidObjectId(_id)) {
                    let objectId = mongoose.Types.ObjectId.createFromHexString(_id);
                } else {
                    return res.status(400).json({ error: "ID inválido" });
                }
            } catch (error) {
                console.log('error :>> ', error);
                return res.status(400).json({ error: "ID inválido" });
            }

            if (status !== STATUS.ALL) query = { estado: status, id_tecnico: objectId };
            else query = { id_tecnico: objectId };
          }
            
        //   console.log('query :>> ', query);
          const result = await ticketModel.paginate(query, options);

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
            user: _id,
            ...result,
            docs: ticketsWithCounts,
          });

        // const options = {
        //   page: page,
        //   limit: 2
        // }
        // ticketModel.paginate({},options, (err, docs) =>{
        //   res.send({
        //     items: docs
        //   })
        // })

        // const tickets = await ticketModel.find()
        // .populate('id_usuario', 'nombre apellido username email imagen') 
        // .populate('id_tecnico', 'nombre apellido username email imagen'); 

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTickets = async (req, res) => {
    try {
        const tickets = await ticketModel.find();
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

        const userLike = await likesTicketModel.countDocuments({ id_ticket: objectId });
        
        const [ticket] = await ticketModel.aggregate([
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
                    as: "comentarios",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "id_usuario",
                                foreignField: "_id",
                                as: "usuario",
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
                                from: "likes_comments",
                                localField: "_id",
                                foreignField: "id_comentario",
                                as: "likes",
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "id_usuario",
                    foreignField: "_id",
                    as: "informante",
                },
            },
            {
                $unwind: {
                    path: "$informante",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "users", 
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

        res.status(200).json({ticket, liked: userLike > 0});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createTicket = async (req, res) => {
    try {
        const { titulo, descripcion, imagen, visibilidad } = req.body;
        const token = req.headers['authorization'];
        const decoded = jwt.verify(token, process.env.JWT_KEY);

    let fullUrl = null;
        console.log('req.file :>> ', req.file);
    if (req.file) {
      try {
        fullUrl = `${process.env.BASE_URL}/images/users/tickets/${req.file.filename}`;
        console.log('fullUrl :>> ', fullUrl);
      } catch (error) {
        const filePath = path.join(__dirname, `../../images/users/tickets/${req.file.filename}`);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error al eliminar el archivo después del fallo:", err);
          }
        });
        return res.status(500).json({ message: "Error al procesar la imagen", error: error.message });
      }
    }
        console.log('imagen :>> ', imagen);
        const ticket = await ticketModel.create({
            id_usuario: decoded._id,
            titulo,
            descripcion,
            imagen: fullUrl,
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

        const ticket = await ticketModel.findByIdAndUpdate(_id, {
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
        const ticket = await ticketModel.findByIdAndDelete(id);
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
    assignTechnician,
    getTicketsCounts,
    getTechniciansCounts
};