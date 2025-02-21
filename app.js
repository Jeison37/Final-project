const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors');
const { dbConnect } = require('./src/config/mongo'); 
const path = require('path');
dbConnect(); 

const PORT = process.env.PORT || 3000; 
app.use(cors()); 
app.use(express.json()); 

app.use('/api/', require('./app/routes'));

app.listen(PORT, ()=>{
  console.log("La api esta lista...");
  console.log(`Servidor corriento en http://localhost:${PORT}`);
});



