const express = require('express');
const router = express.Router();
const { getUsers, addProfilePicture, getUser } = require('../controllers/users');
const { createUser } = require('../controllers/signup');
const { login } = require('../controllers/login');
const { auth } = require('../middlewares/auth');
const { upload } = require('../middlewares/multer');

router.get('/', auth([]) , getUsers);

router.get('/auth', auth([]), (req,res) =>{
  res.status(200).json({message: "Autenticado"});
});

router.get('/profile_picture/add', auth([]), (req, res, next)=>{
    upload.single("imagen")(req,res, next);
  }, addProfilePicture);

router.post('/login', login);

router.post('/signup', createUser);

router.get('/profile', getUser);


module.exports = router;