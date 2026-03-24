const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TELEGRAM_TOKEN = '8730751944:AAErirL2kP2zpB5oUmzJYY_A5G6HjC_JQzU';
const MI_CHAT_ID = '7050856247';

app.get('/', (req, res) => res.send('🚀 Filtro de Sevilla Digital: ACTIVO'));

app.post('/webhook/shopify', async (req, res) => {
    // 1. Respondemos rápido a Shopify
    res.status(200).send('Recibido');

    const order = req.body;
    let playerID = null;

    // 2. BUSCAMOS EL ID SOLO EN LOS PRODUCTOS QUE LO TIENEN
    if (order.line_items) {
        order.line_items.forEach(item => {
            if (item.properties) {
                const prop = item.properties.find(p => p.name === "ID_Jugador");
                if (prop) playerID = prop.value;
            }
        });
    }

    // 3. LA REGLA DE ORO: Si no hay Player ID, NO mandamos nada a Telegram
    if (!playerID || playerID === "No proporcionado") {
        console.log("⏭️ Orden ignorada: No es un producto de recarga (Sin ID).");
        return; 
    }

    // 4. Si llegamos aquí, es porque SÍ es Free Fire
    const mensaje = `
🔥 *¡NUEVA RECARGA DE DIAMANTES!* 🔥
----------------------------------
👤 *Cliente:* ${order.customer ? order.customer.first_name : 'Cliente'}
🆔 *PLAYER ID:* ${playerID}
💰 *Monto:* ${order.total_price} ${order.currency}
🛒 *Producto:* ${order.line_items ? order.line_items.title : 'Diamantes Free Fire'}
----------------------------------
✅ *Acción:* Recargá ahora en Pagostore.
    `;

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: MI_CHAT_ID,
            text: mensaje,
            parse_mode: 'Markdown'
        });
        console.log("✅ Aviso de Free Fire enviado a Telegram.");
    } catch (error) {
        console.error("❌ Error enviando a Telegram:", error.message);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Filtro corriendo en puerto ${PORT}`));
