const express = require('express');
const router = express.Router();
const commentModal = require("../models/comments");
const jwt = require('jsonwebtoken');

const { getComments, createComment, updateComment, deleteComment } = require('../controllers/comments');
const { auth } = require('../middlewares/auth');

router.get('/', auth([]), getComments);

router.post('/', auth([]) , createComment);

router.put('/:id', auth([]) , updateComment);

router.delete('/:id', auth([]) , deleteComment);

module.exports = router;