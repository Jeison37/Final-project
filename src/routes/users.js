const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser, updateAccount } = require('../controllers/users');
const { createUser } = require('../controllers/signup');
const { login } = require('../controllers/login');
const { auth } = require('../middlewares/auth');
const { premium } = require('../middlewares/premium');
const { upload } = require('../middlewares/multer');
const constants = require('../utils/constants');

router.get('/', auth([constants.ROL.ADMIN]) , getUsers);

router.get('/auth', auth([]), (req,res) =>{
  res.status(200).json({message: "Autenticado"});
});

router.get('/premium', auth([]), premium(), (req,res) =>{
  res.status(200).json({message: "Premium"});
});

router.post('/login', login);

router.delete("/:id", auth([constants.ROL.ADMIN]) , deleteUser);

router.post('/signup', createUser);

router.get('/profile', auth([]), getUser);

router.put('/profile', auth([]), (req, res, next)=>{
  upload.single("imagen")(req,res, next);
}, updateUser);

router.put('/account/:id/update', auth([constants.ROL.ADMIN]), (req, res, next)=>{
  upload.single("imagen")(req,res, next);
}, updateAccount);

// router.put('/profile', auth([]), (req, res, next)=>{
//   upload.single("imagen")(req,res, next);
// }, addProfilePicture);

module.exports = router;