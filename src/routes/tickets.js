const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { getAllTicketData, getTicket, createTicket, updateTicket, deleteTicket, getTickets, changeStatus, assignTechnician } = require("../controllers/tickets");
const { ROL, STATUS } = require('../utils/constants');

const option = (page = 1, limit = 5, status) => {

    const options = {
        page, 
        limit, 
        populate: [
        { path: 'id_usuario', select: 'nombre apellido username email imagen' },
        { path: 'id_tecnico', select: 'nombre apellido username email imagen' },
        ],
    }

    if (status) options.query = { estado: status };

    return options;
}

router.post('/main', auth([]) ,(req, res) =>  getAllTicketData(req, res, option(req.body.page, req.body.limit)));
router.post('/main/pending', auth([ROL.TECHNICIAN]) , (req, res) =>  getAllTicketData(req, res, option(req.body.page, req.body.limit, STATUS.PENDING)));
router.post('/main/completed', auth([ROL.TECHNICIAN]) , (req, res) =>  getAllTicketData(req, res, option(req.body.page, req.body.limit, STATUS.COMPLETED)));

router.get('/main/:id', auth([]) , getTicket);

// router.get('/:id', auth([]) , getTicket);

router.post('/', auth([]) , createTicket);

router.put('/status', auth([ROL.TECHNICIAN]) , changeStatus);

router.put('/assign', auth([ROL.TECHNICIAN]) , assignTechnician);

router.put('/:id', auth([]) , updateTicket);

router.delete('/:id', auth([]) , deleteTicket);

module.exports = router;
