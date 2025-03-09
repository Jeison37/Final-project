const userModel = require("../models/users");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../controllers/email");

const createUser = async (req, res) => {


  try {
    const { nombre, apellido, email, password, username, direccion, rol } = req.body;

    // Se revisa si el username ya existe en la base de datos
    const usernameExists = await userModel.findOne({ username });
    if (usernameExists) {
      return res.status(409).json({ message: "El nombre de usuario ya esta usado" });
    }

    // Se revisa si el email ya existe en la base de datos
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ message: "El email ya esta usado" });
    }

    // Se crea el usuario
    const user = await userModel.create({
      nombre,
      apellido,
      email,
      password: await userModel.encryptPassword(password),
      username, direccion,
      rol,
    });

    const token = jwt.sign({ _id: user._id , rol: user.rol}, process.env.JWT_KEY, {
        expiresIn: "1d",
    });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Bienvenido a la Plataforma Web de Reporte de Fallas y Dudas ',
    text: '¡Bienvenido! ¡Gracias por haber creado una cuenta en nuestra plataforma web, sintete libre de reportar cualquier falla o duda que tengas!',
  };
  
  try{
    await sendEmail(mailOptions);
 }catch(error){
     console.error("error enviando correo", error);
 }
    
    res.status(201).json({ token , imagen: user.imagen, rol: user.rol});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createUser };