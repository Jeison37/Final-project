const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/auth');

const { getTicketsAllData, getTicket, createTicket, updateTicket, deleteTicket, getTickets } = require("../controllers/tickets")

router.get('/main', auth([]) , getTicketsAllData);

router.get('/', auth([]) , getTickets);

router.get('/:id', auth([]) , getTicket);

router.post('/', auth([]) , createTicket);

router.put('/:id', auth([]) , updateTicket);

router.delete('/:id', auth([]) , deleteTicket);

module.exports = router;
