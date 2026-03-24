const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// TUS CLAVES REALES (Sacadas de tu captura)
const TELEGRAM_TOKEN = '8730751944:AAErirL2kP2zpB5oUmzJYY_A5G6HjC_JQzU';
const MI_CHAT_ID = '7050856247';

// ESTO ES PARA PROBAR QUE EL SERVIDOR ESTÁ VIVO
app.get('/', (req, res) => {
    res.send('Servidor de Sevilla Digital: ACTIVO 🚀');
});

// LA RUTA DEL WEBHOOK
app.post('/webhook/shopify', async (req, res) => {
    console.log("-----------------------------------------");
    console.log("🔔 ¡LLEGÓ UNA LLAMADA DE SHOPIFY!"); 
    
    const order = req.body;

    // Intentar sacar el ID del jugador de las propiedades o de la nota
    let playerID = "No proporcionado";
    if (order.line_items && order.line_items.length > 0) {
        const item = order.line_items;
        if (item.properties && item.properties.length > 0) {
            const propID = item.properties.find(p => p.name === "ID_Jugador");
            if (propID) playerID = propID.value;
        }
    }

    if (playerID === "No proporcionado" && order.note) {
        playerID = order.note;
    }

    const mensaje = `
🚀 *¡NUEVA VENTA EN SEVILLA DIGITAL!*
💰 *Monto:* ${order.total_price || '0.00'} ${order.currency || 'USD'}
👤 *Cliente:* ${order.customer ? order.customer.first_name : 'Cliente'}
🆔 *PLAYER ID:* ${playerID}
--------------------------
Mete el ID en Pagostore y cobrá! 💎
    `;

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: MI_CHAT_ID,
            text: mensaje,
            parse_mode: 'Markdown'
        });
        console.log("✅ Mensaje enviado a Telegram correctamente.");
    } catch (error) {
        console.error("❌ Error enviando a Telegram:", error.message);
    }

    res.status(200).send('OK');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Sevilla Digital corriendo en puerto ${PORT}`);
});
