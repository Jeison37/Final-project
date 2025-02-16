const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/users');
const { login } = require('../controllers/login');
const { auth } = require('../middleware/auth');

router.get('/users', getUsers);

router.post('/login', login);

router.post('/singup', createUser);

module.exports = router;