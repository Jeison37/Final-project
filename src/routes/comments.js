const express = require('express');
const router = express.Router();

const { getComments, createComment, updateComment, deleteComment } = require('../controllers/comments');
const { auth } = require('../middleware/auth');

router.get('/comments', auth([]) , getComments);

router.post('/comment', auth([]) , createComment);

router.put('/comment/:id', auth([]) , updateComment);

router.delete('/comment/:id', auth([]) , deleteComment);

module.exports = router;