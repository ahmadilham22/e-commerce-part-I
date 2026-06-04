import "dotenv/config"
import { connectionRabbitMQ } from "../utils/rabbitMq.js"
import { sendTelegramBotNotification } from "../utils/telegramUsingFetch.js"

const startWorker = async () => {
  let channel = await connectionRabbitMQ()
  await channel.assertQueue("telegram-notifications", { durable: true })
  channel.consume("telegram-notifications", async (msg) => {
    try {
      const message = msg.content.toString()
      await sendTelegramBotNotification(message)
      channel.ack(msg)
    } catch (error) {
      channel.nack(msg)
    }
  })
}

startWorker()