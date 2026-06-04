import amqplib from "amqplib"
import { logger } from "../app/logging.js";

const connectionRabbitMQ = async () => {
  let connection
  try {
    connection = await amqplib.connect('amqp://localhost:5672');
    const channel = await connection.createChannel()
    
    return channel
  } catch (error) {
    logger.error(`Error rabbitmq: ${error.message}`);
  }  
};


export {
  connectionRabbitMQ
}