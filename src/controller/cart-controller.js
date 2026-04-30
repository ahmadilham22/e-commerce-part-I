import cartService from "../service/cart-service.js"

const create = async (req, res, next) => {
  try {
    const result = await cartService.createCart(req)
    res.status(201).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const get = async (req, res, next) => {
  try {
    const result = await cartService.getCart(req)
    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const result = await cartService.updateCart(req)
    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const result = await cartService.removeCart(req)
    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export default {
  create,
  get,
  update,
  remove
}