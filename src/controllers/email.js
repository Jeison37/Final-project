const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


// const sendEmail = async (mailOptions) => {
//     try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log("Correo enviado: " + info.response);
//         return info; // Retorna la información del correo enviado
//     } catch (error) {
//         console.error("Error al enviar el correo:", error);
//         throw error; // Lanza el error para que pueda ser manejado en createUser
//     }
// };

const sendEmail = (mailOptions) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Correo enviado: " + info.response);
      }
    });
  };

module.exports = { sendEmail };