const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { premium } = require('../middlewares/premium');
const { getChatRequests, createChat, addTechnician, deleteChat, getChat } = require('../controllers/chats');
const { ROL } = require('../utils/constants');

router.get('/', auth([ROL.TECHNICIAN]) , getChatRequests);

router.get('/:id', auth([]), premium() , getChat);

router.put('/:id', auth([ROL.TECHNICIAN]), premium() , getChat);

router.post('/', auth([]) , premium(), createChat);

router.delete('/', auth([]) , premium(), deleteChat);

router.put('/', auth([ROL.TECHNICIAN]) , addTechnician);

module.exports = router;