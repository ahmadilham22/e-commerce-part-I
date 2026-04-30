import TelegramBot from 'node-telegram-bot-api';
import { logger } from "../app/logging.js";

// Token didapat dari @BotFather di telegram
const token = process.env.TELEGRAM_BOT_TOKEN;

// Inisialisasi Bot dengan 'polling: false' karena kita JALUR SATU ARAH (hanya mengirim webhook)
// (Kalau butuh bot yang bisa ngebales chat, polling ubah ke true)
let bot;
if (token) {
    bot = new TelegramBot(token, { polling: false });
} else {
    logger.warn("Telegram Token is not configured in .env");
}

const sendTelegramNotification = async (message) => {
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Cek keamanan, jangan kirim jika tidak ada ID chat atau bot belum siap
    if (!bot || !chatId) {
        logger.warn("Cannot send telegram notification: Missing Bot Instance or Chat ID");
        return;
    }

    try {
        // Mengirim pesan dengan format HTML biar rapi
        await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
        logger.info("Telegram notification sent via NPM package");
    } catch (error) {
        logger.error(`Error sending Telegram notification: ${error.message}`);
    }
};

export { sendTelegramNotification };
