const express = require('express');
const router = express.Router();
const { getUsers, createUser, addProfilePicture } = require('../controllers/users');
const { login } = require('../controllers/login');
const { auth } = require('../middlewares/auth');
const { upload } = require('../middlewares/multer');

router.get('/', auth([]) , getUsers);

router.get('/profile_picture/add', auth([]), (req, res, next)=>{
    upload.single("imagen")(req,res, next);
  }, addProfilePicture);

router.post('/login', login);

router.post('/signup', createUser);

module.exports = router;