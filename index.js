const express = require('express');
const axios = require('axios'); // Nueva herramienta para enviar mensajes
const app = express();
app.use(express.json());

// CONFIGURACIÓN (Pegá tus datos aquí)
const TELEGRAM_TOKEN = '8730751944:AAErirL2kP2zpB5oUmzJYY_A5G6HjC_JQzU';
const MI_CHAT_ID = '7050856247'; // Yo te ayudo a sacarlo ahora

app.post('/webhook/shopify', async (req, res) => {
    const order = req.body;

    // 1. Extraemos los datos de la orden
    const orderNumber = order.name;
    const total = order.total_price;
    const customer = order.customer ? order.customer.first_name : 'Cliente';
    
    // Aquí buscaremos el ID del jugador que el cliente dejó en las notas
    const playerID = order.note || "No proporcionado"; 

    // 2. Armamos el mensaje para tu Telegram
    const mensaje = `
🚀 *¡NUEVA VENTA EN SEVILLA DIGITAL!*
💰 *Monto:* ${total} ${order.currency}
👤 *Cliente:* ${customer}
🆔 *PLAYER ID:* ${playerID}
--------------------------
Mete el ID en Pagostore y cobrá! 💎
    `;

    // 3. Te enviamos el aviso
    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: MI_CHAT_ID,
            text: mensaje,
            parse_mode: 'Markdown'
        });
        console.log("Aviso enviado a Freyson");
    } catch (error) {
        console.error("Error avisando a Telegram", error);
    }

    res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
