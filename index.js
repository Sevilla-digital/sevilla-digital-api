const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// CONFIGURACIÓN DE TU BOT (Datos de tus capturas)
const TELEGRAM_TOKEN = '8730751944:AAErirL2kP2zpB5oUmzJYY_A5G6HjC_JQzU';
const MI_CHAT_ID = '7050856247';

// 1. RUTA DE PRUEBA (Para ver en el navegador)
app.get('/', (req, res) => {
    res.send('✅ Sevilla Digital API: El motor está encendido y escuchando.');
});

// 2. RUTA DEL WEBHOOK (Donde Shopify envía la info)
app.post('/webhook/shopify', async (req, res) => {
    // IMPORTANTE: Le respondemos a Shopify de inmediato para que no se desconecte
    res.status(200).send('Recibido');

    console.log("-----------------------------------------");
    console.log("🔔 ¡NOTIFICACIÓN DE SHOPIFY DETECTADA!");

    const order = req.body;

    // Buscamos el ID del jugador en las propiedades del producto (Cuadro naranja)
    let playerID = "No proporcionado";
    
    try {
        if (order.line_items && order.line_items.length > 0) {
            const item = order.line_items;
            // Buscamos específicamente la propiedad "ID_Jugador"
            if (item.properties && item.properties.length > 0) {
                const foundProp = item.properties.find(p => p.name === "ID_Jugador");
                if (foundProp) playerID = foundProp.value;
            }
        }

        // Si no está en el producto, buscamos en la nota de la orden
        if (playerID === "No proporcionado" && order.note) {
            playerID = order.note;
        }

        // Formateamos el mensaje para Telegram
        const mensaje = `
🚀 *¡NUEVA VENTA EN SEVILLA DIGITAL!*
----------------------------------
💰 *Total:* ${order.total_price || '0.00'} ${order.currency || 'USD'}
👤 *Cliente:* ${order.customer ? order.customer.first_name : 'Sin nombre'}
🆔 *PLAYER ID:* ${playerID}
----------------------------------
💎 *Estado:* Listo para recargar en Pagostore.
        `;

        // Enviamos el mensaje a tu Telegram
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: MI_CHAT_ID,
            text: mensaje,
            parse_mode: 'Markdown'
        });

        console.log("✅ Mensaje enviado a Telegram para el ID:", playerID);

    } catch (error) {
        console.error("❌ Error procesando el webhook:", error.message);
    }
});

// 3. INICIO DEL SERVIDOR
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
