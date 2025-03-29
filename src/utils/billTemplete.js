export const billTemplete = (bill, name, email) => {

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .invoice {
            background: linear-gradient(to bottom, #283D5B, #162130);
  background-repeat: no-repeat;
  color: #fff;
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .invoice h1 {
            text-align: center;
            color: #4CAF50;
        }
        .invoice-details, .customer-details, .transaction-details {
            margin-bottom: 20px;
        }
        .invoice-details p, .customer-details p, .transaction-details p {
            margin: 5px 0;
        }
        .invoice-details span, .customer-details span, .transaction-details span {
            font-weight: 800;
        }
        .thank-you {
            text-align: center;
            margin-top: 20px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="invoice">
        <h1>Factura</h1>
        
        <div class="invoice-details">
            <p><span>Número de Factura: ${bill._id}</span> </p>
            <p><span>Fecha de Emisión:</span> ${bill.createdAt} </p>
            <p><span>Estado:</span> ${bill.estado} </p>
            <p><span>Método de Pago:</span> ${bill.metodo_pago} </p>
        </div>

        <div class="customer-details">
            <h2>Detalles del Cliente</h2>
            <p><span>Nombre:</span> ${name} </p>
            <p><span>Correo Electrónico:</span> ${email} </p>
        </div>

        <div class="transaction-details">
            <h2>Detalles de la Transacción</h2>
            <p><span>Monto:</span> $${bill.monto}</p>
            <p><span>Descripción:</span> Pago realizado a través de PayPal.</p>
        </div>

        <div class="thank-you">
            <p>Gracias por su compra!</p>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>
    </div>
</body>
</html>
    `;
}