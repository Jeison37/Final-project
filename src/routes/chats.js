const express = require('express');
const router = express.Router();

const { getChatRequests, createChat, addTechnician } = require('../controllers/chats');

router.get('/', getChatRequests);

router.post('/', createChat);

router.put('/', addTechnician);

module.exports = router;