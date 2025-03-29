const express = require('express');
const router = express.Router();
const { getBills } = require('../controllers/bills');
const { auth } = require('../middlewares/auth');

router.get('/', auth([]) , getBills );

module.exports = router;