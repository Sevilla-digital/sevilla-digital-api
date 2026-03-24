const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TELEGRAM_TOKEN = '8730751944:AAErirL2kP2zpB5oUmzJYY_A5G6HjC_JQzU';
const MI_CHAT_ID = '7050856247';

app.get('/', (req, res) => {
    res.send('Servidor de Sevilla Digital: ACTIVO 🚀');
});

app.post('/webhook/shopify', async (req, res) => {
    // 1. LE RESPONDEMOS A SHOPIFY DE INMEDIATO (Para que no se queje)
    res.status(200).send('OK');
    
    console.log("-----------------------------------------");
    console.log("🔔 ¡LLEGÓ UNA LLAMADA DE SHOPIFY!"); 

    const order = req.body;

    // 2. Lógica del ID (Igual que antes)
    let playerID = "No proporcionado";
    if (order.line_items && order.line_items.length > 0) {
        const item = order.line_items;
        if (item.properties) {
            const propID = item.properties.find(p => p.name === "ID_Jugador");
            if (propID) playerID = propID.value;
        }
    }
    if (playerID === "No proporcionado" && order.note) playerID = order.note;

    const mensaje = `
🚀 *¡NUEVA VENTA EN SEVILLA DIGITAL!*
💰 *Monto:* ${order.total_price || '0.00'} ${order.currency || 'USD'}
👤 *Cliente:* ${order.customer ? order.customer.first_name : 'Cliente'}
🆔 *PLAYER ID:* ${playerID}
--------------------------
Mete el ID en Pagostore! 💎
    `;

    // 3. Enviamos a Telegram después de haberle respondido a Shopify
    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: MI_CHAT_ID,
            text: mensaje,
            parse_mode: 'Markdown'
        });
        console.log("✅ Mensaje enviado a Telegram.");
    } catch (error) {
        console.error("❌ Error Telegram:", error.message);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Corriendo en puerto ${PORT}`));
