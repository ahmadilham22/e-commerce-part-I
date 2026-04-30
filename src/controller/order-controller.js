import orderService from "../service/order-service.js"

const created = async (req, res, next) => {
  try {
    const user = req.user
    const request =  req.body
    const result = await orderService.createOrder(user, request)
    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const checkoutCart = async (req, res, next) => {
  try {
    const result = await orderService.checkOutFromCart(req)
    res.status(201).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const notification = async (req, res, next) => {
  try {
    const result = await orderService.handleWebhook(req.body)
    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getOrder = async (req, res, next) => {
  try {
    const result = await orderService.getOrder()
    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export default {
  created, notification, getOrder, checkoutCart
}