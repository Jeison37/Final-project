const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/auth');

const { getTicketsAllData, getTicket, createTicket, updateTicket, deleteTicket, getTickets } = require("../controllers/tickets")

router.get('/tickets/main', auth([]) , getTicketsAllData);

router.get('/tickets', auth([]) , getTickets);

router.get('/ticket/:id', auth([]) , getTicket);

router.post('/ticket', auth([]) , createTicket);

router.put('/ticket/:id', auth([]) , updateTicket);

router.delete('/ticket/:id', auth([]) , deleteTicket);

module.exports = router;
