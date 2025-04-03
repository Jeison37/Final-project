const express = require('express');
const router = express.Router();
const { getBills } = require('../controllers/bills');
const { auth } = require('../middlewares/auth');
const constants = require('../utils/constants');

router.get('/', auth([]) , getBills );

router.get('/:id', auth([constants.ROL.ADMIN]) , getBills );

module.exports = router;