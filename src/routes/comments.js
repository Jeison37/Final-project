const express = require('express');
const router = express.Router();

const { getComments, createComment, updateComment, deleteComment } = require('../controllers/comments');
const { auth } = require('../middleware/auth');

router.get('/', auth([]) , getComments);

router.post('/', auth([]) , createComment);

router.put('/:id', auth([]) , updateComment);

router.delete('/:id', auth([]) , deleteComment);

module.exports = router;