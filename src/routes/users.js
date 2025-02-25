const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/users');
const { login } = require('../controllers/login');
const { auth } = require('../middlewares/auth');

router.get('/', getUsers);

router.post('/login', login);

router.post('/singup', createUser);

module.exports = router;