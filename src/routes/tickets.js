const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { getAllTicketData, getTechniciansCounts, getTicketsCounts ,getTicket, createTicket, updateTicket, deleteTicket, getTickets, changeStatus, assignTechnician } = require("../controllers/tickets");
const { ROL, STATUS } = require('../utils/constants');
const { upload } = require('../middlewares/multer');


router.post('/main', auth([]) ,(req, res) =>  getAllTicketData(req, res));
router.post('/main/pending', auth([ROL.TECHNICIAN, ROL.ADMIN]) , (req, res) =>  getAllTicketData(req, res, STATUS.PENDING));
router.post('/main/completed', auth([ROL.TECHNICIAN, ROL.ADMIN]) , (req, res) =>  getAllTicketData(req, res, STATUS.COMPLETED));
router.post('/main/all', auth([ROL.TECHNICIAN, ROL.ADMIN]) , (req, res) =>  getAllTicketData(req, res, STATUS.ALL));


router.get('/main/:id', auth([]) , getTicket);

router.post('/', auth([]) , (req, res, next)=>{
    upload.single("imagen")(req,res, next);
  }, createTicket);

router.put('/status', auth([ROL.TECHNICIAN, ROL.ADMIN]) , changeStatus);

router.put('/assign', auth([ROL.TECHNICIAN, ROL.ADMIN]) , assignTechnician);

router.get('/dashboard', auth([]) , getTicketsCounts);

router.get("/dashboard/admin", auth([ROL.ADMIN]) , getTechniciansCounts);

router.put('/:id', auth([]) , (req, res, next) => {
  upload.single("imagen")(req, res, next); 
},updateTicket);

router.delete('/:id', auth([]) , deleteTicket);

module.exports = router;
