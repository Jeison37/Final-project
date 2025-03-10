const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { getAllTicketData, getTicket, createTicket, updateTicket, deleteTicket, getTickets, changeStatus, assignTechnician } = require("../controllers/tickets");
const { ROL, STATUS } = require('../utils/constants');

const option = (page = 1, limit = 5, status, req, res) => {

    const options = {
        page, 
        limit, 
        populate: [
        { path: 'id_usuario', select: 'nombre apellido username email imagen' },
        { path: 'id_tecnico', select: 'nombre apellido username email imagen' },
        ],
    }
    console.log(status)
    if (status !== undefined) {
        console.log("Hello MF")
        const jwt = require('jsonwebtoken');
        const { _id } = jwt.verify(req.headers['authorization'], process.env.JWT_KEY);
        options.query = { estado: status}
    }

    return options;
}

router.post('/main', auth([]) ,(req, res) =>  getAllTicketData(req, res, option(req.body.page, req.body.limit)));
router.post('/main/pending', auth([ROL.TECHNICIAN]) , (req, res) =>  getAllTicketData(req, res, option(req.body.page, req.body.limit, STATUS.PENDING, req, res)));
router.post('/main/completed', auth([ROL.TECHNICIAN]) , (req, res) =>  getAllTicketData(req, res, option(req.body.page, req.body.limit, STATUS.COMPLETED, req, res)));

router.get('/main/:id', auth([]) , getTicket);

// router.get('/:id', auth([]) , getTicket);

router.post('/', auth([]) , (req, res, next)=>{
    upload.single("imagen")(req,res, next);
  }, createTicket);

router.post('/status', auth([ROL.TECHNICIAN]) , changeStatus);

router.post('/assign', auth([ROL.TECHNICIAN]) , assignTechnician);

router.put('/:id', auth([]) , updateTicket);

router.delete('/:id', auth([]) , deleteTicket);

module.exports = router;
