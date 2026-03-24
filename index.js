const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor de Sevilla Digital Activo 🚀');
});

// Ruta para el Webhook de Shopify
app.post('/webhook/shopify', (req, res) => {
  console.log('Orden recibida de Shopify:', req.body.id);
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Corriendo en puerto ${PORT}`);
});
