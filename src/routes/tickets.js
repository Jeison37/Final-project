const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/auth');

const { getTicketsAndLikes, getTicket, createTicket, updateTicket, deleteTicket, getTickets } = require("../controllers/tickets")

router.get('/tickets/main', auth([]) , getTicketsAndLikes);

router.get('/tickets', auth([]) , getTickets);

router.get('/ticket/:id', auth([]) , getTicket);

router.post('/ticket', auth([]) , createTicket);

router.put('/ticket/:id', auth([]) , updateTicket);

router.delete('/ticket/:id', auth([]) , deleteTicket);

module.exports = router;
