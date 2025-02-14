require('dotenv').config(); 
const express = require('express'); 
const cors = require('cors'); 
const app = express(); 
const { dbConnect } = require('./config/mongo'); 
const path = require('path');
dbConnect(); 

const PORT = process.env.PORT || 3002; 
app.use(cors()); 
app.use(express.json()); 


app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/', require('./app/routes'));

app.listen(PORT, ()=>{
  console.log("La api esta lista...");
  console.log(`Servidor corriento en http://localhost:${PORT}`);
});