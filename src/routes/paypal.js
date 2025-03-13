const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { updateDatePremium } = require('../controllers/users');


router.post("/create-order", async (req, res) => {
  try {
    const token = req.headers['authorization'];

    const { _id } = jwt.verify(token, process.env.JWT_KEY);

  const {  amount = 5} = req.body;
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
          return_url: `http://localhost:3002/capture-order?user=${_id}`,
          cancel_url: "http://localhost:3002/cancel-order",
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
          headers:{
            "Content-Type": "application/x-www-form-urlencoded",
          },
          auth:{
            username: process.env.PAYPAL_CLIENT_KEY,
            password: process.env.PAYPAL_SECRET_KEY
          }
        }
      );
  
      const response = await axios.post(
        `${process.env.PAYPAL_DEV_URL}/v2/checkout/orders`,
        order,
        {
          headers:{
            Authorization: `Bearer ${access_token}`
          }
        }
      );
      
      res.json({redirectUrl: response.data.links[1].href,message:"Orden creada"});
    } catch (error) {
      console.log(error)
      return res.status(500).json(error);
    }
  });
  
  router.get('/capture-order', async(req,res)=>{
    const { token, user} = req.query;
    try{
      const response = await axios.post(
        `${process.env.PAYPAL_DEV_URL}/v2/checkout/orders/${token}/capture`,
        {},
        {
          auth:{
            username: process.env.PAYPAL_CLIENT_KEY,
            password: process.env.PAYPAL_SECRET_KEY
          }
        }
      );
      if(response.data){


  try {

  const date = new Date();
  date.setMonth(date.getMonth() + 1);

  const user = await userModel.findByIdAndUpdate(id, {
    fechaPremium: date
  });

  if (user) console.log("User updated successfully");

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
        console.log(response.data);
        return res.json({message:"Pago confirmado", monto_pagado: response.data.purchase_units[0].payments.captures[0].amount.value});
      }
      return res.json({message:"Error al confirmar el pago"});
    }catch(error){
  
    }
  });
  
  router.get("/cancel-order", (req, res) => {
    res.json({ message: "Orden cancelada" });
  })


module.exports = router;