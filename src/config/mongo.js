const mongoose = require('mongoose');

const dbConnect = () =>{
  mongoose.connect(process.env.DB_URL)
  .then(()=>{
    console.log("Conexion exitosa a la base de datos");
  })
  .catch(err => console.log(err));
};

module.exports = { dbConnect };