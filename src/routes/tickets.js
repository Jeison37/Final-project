const express = require('express');
const router = express.Router();

const { auth } = require('../middlewares/auth');

const { getAllTicketData, getTicket, createTicket, updateTicket, deleteTicket, getTickets, changeStatus, assignTechnician } = require("../controllers/tickets");
const { ROL } = require('../utils/constants');

router.post('/main', auth([]) , getAllTicketData);

router.get('/main/:id', auth([]) , getTicket);

// router.get('/:id', auth([]) , getTicket);

router.post('/', auth([]) , createTicket);

router.put('/status', auth([ROL.TECHNICAL]) , changeStatus);

router.put('/assign', auth([ROL.TECHNICAL]) , assignTechnician);

router.put('/:id', auth([]) , updateTicket);

router.delete('/:id', auth([]) , deleteTicket);

module.exports = router;
