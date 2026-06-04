import { logger } from "../app/logging.js";

const token = process.env.TELEGRAM_BOT_TOKEN
const chatId = process.env.TELEGRAM_CHAT_ID;

const sendTelegramBotNotification = async (message) => {
  if (!token || !chatId) {
    logger.warn("Cannot send telegram notification: Missing Bot Instance or Chat ID");
    throw new Error("not found token or chat id")
  }

  let url = `https://api.telegram.org/bot${token}/sendMessage`
  let bodyNotification = { chat_id: chatId, text: message, parse_mode: 'HTML' }

  try {
    const fetchTelegram = await fetch(url, {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(bodyNotification)
    })

    const result = await fetchTelegram.json()
    if (result.ok) {
      logger.info("Telegram notification sent via fetch");
    } else {
      logger.warn(`Telegram API error: ${result.description}`)
      throw new Error(`error ${result.description}`)
    }

  } catch (error) {
    logger.error(`Error sending Telegram notification: ${error.message}`);
    throw error
  }
}

export {
  sendTelegramBotNotification
}