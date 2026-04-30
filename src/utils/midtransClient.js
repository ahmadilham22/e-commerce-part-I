import Midtrans from "midtrans-client";

export const snap = new Midtrans.Snap({
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
  isProduction: false
})

export const coreApi = new Midtrans.CoreApi({
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  isProduction: false
})