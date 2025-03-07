const express = require('express');
const router = express.Router();
const { toggleLike, getLikes } = require('../controllers/likes-ticket');
const { auth } = require('../middlewares/auth');

router.post('/', auth([]) , toggleLike);

router.get('/', auth([]) , getLikes);


module.exports = router;