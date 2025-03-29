const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userModel = require("../models/users");
const { auth } = require("../middlewares/auth");
const billModel = require("../models/bills");
const paymentModel = require("../models/payments");
const { billTemplete } = require("../utils/billTemplete");
const { sendEmail } = require("../controllers/email");

router.post("/create-order", auth([]), async (req, res) => {
  console.log("Entró a /paypal/create-order");
  try {
    const _id = req.user._id;

    const { amount = 5 } = req.body;
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: `${amount}.00`,
          },
        },
      ],
      application_context: {
        brand_name: "plataforma_web",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `http://localhost:3000/api/paypal/capture-order?user=${_id}`,
        cancel_url: "http://localhost:3000/api/paypal/cancel-order",
      },
    };

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    const {
      data: { access_token },
    } = await axios.post(
      `${process.env.PAYPAL_DEV_URL}/v1/oauth2/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: process.env.PAYPAL_CLIENT_KEY,
          password: process.env.PAYPAL_SECRET_KEY,
        },
      }
    );

    const response = await axios.post(
      `${process.env.PAYPAL_DEV_URL}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    res.json({
      redirectUrl: response.data.links[1].href,
      message: "Orden creada",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.get("/capture-order", async (req, res) => {
  const { token, user } = req.query;
  console.log("Entró a /paypal/capture-order");
  try {
    const response = await axios.post(
      `${process.env.PAYPAL_DEV_URL}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: process.env.PAYPAL_CLIENT_KEY,
          password: process.env.PAYPAL_SECRET_KEY,
        },
      }
    );
    if (response.data) {
      try {
        /* 
pago
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    monto: {
        type: Number,
        required: true,
    },
    moneda: {
        type: String,
        required: true,
        default: "USD",
    },
    metodo_pago: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        required: true,
    },

*/

        /* 
    bill

    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", 
        required: true,
    },
    id_pago: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment', 
        required: true,
    },
    monto: {
        type: Number,
        required: true,
    },
    moneda: {
        type: String,
        required: true,
        default: 'USD', 
    },
    estado: {
        type: String,
        enum: ['pendiente', 'pagada', 'cancelada'],
        default: 'pendiente', 
    }


*/

        const date = new Date();
        date.setMonth(date.getMonth() + 1);

        const usuario = await userModel.findByIdAndUpdate(user, {
          premiumFecha: date,
        }, { new: true });

        console.log('req.user, user :>> ', req.user, user);
        const payment = await paymentModel.create({
          id_usuario: user,
          monto: 5,
          estado: "pagada",
          metodo_pago: "paypal",
        });

        
        const bill = await billModel.create({
          id_pago: payment._id,
          id_usuario: user,
          monto: 5,
          estado: "pagada",
          metodo_pago: "paypal",
        });

        if (bill) {
          console.log("A mandar correo");
          const mailOptions = {
            from: process.env.EMAIL,
            to: usuario.email,
            subject: "Factura",
            html: billTemplete(
              bill,
              usuario.nombre + " " + usuario.apellido,
              usuario.email
            ),
          };

          try {
            sendEmail(mailOptions);
          } catch (error) {
            console.error("error enviando correo", error);
          }
          console.log("Bill created successfully");
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      // console.log(response.data);
      // return res.json({message:"Pago confirmado", monto_pagado: response.data.purchase_units[0].payments.captures[0].amount.value});
      return res.redirect("http://localhost:5173/chat");
    }
    return res.json({ message: "Error al confirmar el pago" });
  } catch (error) {
    const usuario = await userModel.findByIdAndUpdate(user, {
      premiumFecha: null,
    }, { new: true });
    console.error("Error al capturar el pago:", error);
  }
});

router.get("/cancel-order", (req, res) => {
  res.json({ message: "Orden cancelada" });
});

module.exports = router;
