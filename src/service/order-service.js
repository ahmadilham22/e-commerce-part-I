import { prismaClient } from "../app/database.js"
import { ResponseError } from "../error/response-error.js"
import { snap, coreApi } from "../utils/midtransClient.js"
import { connectionRabbitMQ } from "../utils/rabbitMq.js"
import { sendTelegramNotification } from "../utils/telegram.js"
import { sendTelegramBotNotification } from "../utils/telegramUsingFetch.js"
import { createOrderValidation } from "../validation/order-validation.js"
import { validate } from "../validation/validation.js"
import crypto from "crypto"


const checkOutFromCart = async (req) => {
  const userId = parseInt(req.user.id)
  const cart = await prismaClient.cart.findFirst({
    where: {
      user_id: userId
    },
    include: {
      cartItems: {
        include: {
          product: true
        }
      }
    }
  })

  if (!cart) {
    throw new ResponseError(404, "Cart not found")
  }

  if (cart.cartItems.length < 1) {
    throw new ResponseError(404, "Item not found")
  }

  let totalAmount = 0
  const orderItemsData = []

  for (const item of cart.cartItems) {
    const subTotal = item.product.price * item.quantity
    totalAmount += subTotal

    orderItemsData.push({
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    })
  }

  const order = await prismaClient.order.create({
    data: {
      user_id: userId,
      total_amount: totalAmount,
      status: "PENDING",
      orderItems: {
        create: orderItemsData
      }
    }, include: {
      user: true
    }
  })

  const parameter = {
    transaction_details: {
      order_id: order.id,
      gross_amount: order.total_amount
    },
    customer_details: {
      first_name: order.user.name,
      email: order.user.email,
      phone: order.user.phone_number
    },
  }

  const transaction = await snap.createTransaction(parameter)
  const redirectUrl = transaction.redirect_url
  const snapToken = transaction.token

  await prismaClient.cartItem.deleteMany({
    where: {
      cart_id: cart.id
    }
  })

  return {
    orderId: order.id,
    snapToken: snapToken,
    totalAmount: order.total_amount,
    redirectUrl: redirectUrl
  }
  
}

const createOrder = async (user, req) => {
  const orderValidate = validate(createOrderValidation, req)  

  let totalAmount = 0
  const orderItemsData = []

  for (const item of orderValidate.items) {
    const product = await prismaClient.product.findUnique({
      where: {
        id: item.product_id
      }
    })

    if (!product) {
      throw new ResponseError(404, "Product not found")
    }

    const subTotal = product.price * item.quantity
    totalAmount += subTotal

    orderItemsData.push({
      product_id: product.id,
      quantity: item.quantity,
      price: product.price
    })
  }

  const order = await prismaClient.order.create({
    data: {
      user_id: user.id,
      total_amount: totalAmount,
      status: "PENDING",
      orderItems: {
        create: orderItemsData
      }
    },
    include: {
      user: true
    }
  })

  const parameter = {
    transaction_details: {
      order_id: order.id,
      gross_amount: order.total_amount
    },
    customer_details: {
      first_name: order.user.name,
      email: order.user.email,
      phone: order.user.phone_number
    },
    // item_details: orderItemsData.map((item) => ({
    //   id: item.product_id,
    //   price: item.price,
    //   quantity: item.quantity,
    //   name: item.product.name
    // }))
  }

  const transaction = await snap.createTransaction(parameter)
  const redirectUrl = transaction.redirect_url
  const snapToken = transaction.token
  return {
    orderId: order.id,
    snapToken: snapToken,
    totalAmount: order.total_amount,
    redirectUrl: redirectUrl
  }
}

const handleWebhook = async (notificationPayload) => {
  // 1. Ambil order_id dari payload
  console.log(notificationPayload);
  
  const orderId = parseInt(notificationPayload.order_id);
  
  if (!orderId) {
    throw new ResponseError(400, "Invalid payload (Order ID missing)");
  }
  // 2. Tanya status transaksi langsung ke Midtrans API (seperti oc.CoreAPIClient.CheckTransaction)
  let transactionStatusResponse;
  try {
    transactionStatusResponse = await coreApi.transaction.status(orderId);
  } catch (error) {
    throw new ResponseError(500, "Failed to verify transaction from Midtrans");
  }
  const transactionStatus = transactionStatusResponse.transaction_status;
  
  // 3. Jika transaksi berhasil (capture / settlement)
  if (transactionStatus === "capture" || transactionStatus === "settlement") {
    // Update status order jadi SUCCESS
    await prismaClient.order.update({
      where: { id: orderId },
      data: { status: "SUCCESS" }
    });
    // Ambil order beserta orderItems-nya
    const order = await prismaClient.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true, user: true } // Sesuaikan dengan schema prisma Anda
    });
    // Kurangi stok product berdasarkan qty yang dibeli
    for (const item of order.orderItems) {
      await prismaClient.product.update({
        where: { id: item.product_id },
        data: { stock: { decrement: item.quantity } }
      });
    }
    console.log(`Transaction success, order ID: ${orderId}, transaction status: ${transactionStatus}`);

    const message = `
🎉 <b>PESANAN BARU BERHASIL DIBAYAR! (Via Lib NPM)</b> 🎉
<b>Order ID:</b> #${order.id}
<b>Pelanggan:</b> ${order.user.name} (${order.user.email})
<b>Total Pendapatan:</b> Rp. ${order.total_amount}
<b>Status:</b> SUCCESS / LUNAS
Silakan cek dashboard backend Anda.
`;
    // Kirim diam-diam tanpa di await agar webhook Midtrans tidak tertunda
    const channel = await connectionRabbitMQ()
    await channel.assertQueue("telegram-notifications", {durable: true})
    channel.sendToQueue("telegram-notifications", Buffer.from(message), {persistent: true})
    // sendTelegramBotNotification(message);
  
  // 4. Jika transaksi gagal / batal / kedaluwarsa (deny / expire / cancel)
  } else if (transactionStatus === "deny" || transactionStatus === "expire" || transactionStatus === "cancel") {
    // Update status order jadi CANCEL
    await prismaClient.order.update({
      where: { id: orderId },
      data: { status: "CANCEL" } 
    });
    // Ambil order beserta orderItems-nya
    const order = await prismaClient.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true }
    });
    // Kembalikan stok product (tambah kembali stok karena batal)
    for (const item of order.orderItems) {
      await prismaClient.product.update({
        where: { id: item.product_id },
        data: { stock: { increment: item.quantity } }
      });
    }
    console.log(`Transaction failed, order ID: ${orderId}, transaction status: ${transactionStatus}`);
  }
};

const getOrder = async () => {
  const orders = await prismaClient.order.findMany(
    {
      include: {
        user: true,
        orderItems: true
      }
    }
  )
  return orders
}

const getOrderHistory = async (req) => {
  const userId = parseInt(req.user.id)

  const result = await prismaClient.order.findMany({
    where: {
      user_id: userId
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              images: true
            }
          }
        }
      }
    }
  })

  return result
}

export default {
  createOrder, handleWebhook, getOrder, checkOutFromCart, getOrderHistory
}