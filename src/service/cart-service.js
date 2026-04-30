import { prismaClient } from "../app/database.js"
import { ResponseError } from "../error/response-error.js"
import { createCartValidation, updateCartValidation } from "../validation/cart-validation.js"
import { validate } from "../validation/validation.js"

const createCart = async (req) => {
  const userId = parseInt(req.user.id)
  const cartValidated = validate(createCartValidation, req.body)
  
  const productExist = await prismaClient.product.findFirst({
    where: {
      id: cartValidated.product_id
    }
  })

  if (!productExist) {
    throw new ResponseError(404, "Product not found")
  }

  const cartExist = await prismaClient.cart.findFirst({
    where: {
      user_id: userId
    }
  })

  let cart 
  if (cartExist) {
    cart = cartExist
  } else {
    cart = await prismaClient.cart.create({
      data: {
        user_id: userId
      }
    })
  }

  const itemsExist = await prismaClient.cartItem.findFirst({
    where: {
      cart_id: cart.id,
      product_id: cartValidated.product_id
    }
  })

  if (itemsExist) {
    await prismaClient.cartItem.updateMany({
      where: {
        product_id: cartValidated.product_id,
        cart_id: cart.id
      }, 
      data: {
        quantity: {
          increment: cartValidated.quantity
        }
      }
    })
  } else {
    await prismaClient.cartItem.create({
      data: {
        cart_id: cart.id,
        product_id: cartValidated.product_id,
        quantity: cartValidated.quantity
      }
    })
  }

  const newCartItem = await prismaClient.cartItem.findFirst({
    where: {
      product_id: cartValidated.product_id,
      cart_id: cart.id
    }
  })

  return newCartItem
}

const getCart = async (req) => {
  const userId = parseInt(req.user.id)

  const result = await prismaClient.cart.findFirst({
    where: {
      user_id: userId
    }, 
    include: {
      cartItems: {
        include: {
          product: {
            include: {
              images: true
            }
          }
      }
    }}
  })

  if (!result) {
    throw new ResponseError(404, "Cart not found")
  }

  return result
}

const updateCart = async (req) => {
  const itemId = parseInt(req.params.item_id)
  const userId = parseInt(req.user.id)
  const updateValidated = validate(updateCartValidation, req.body)

  const cartExist = await prismaClient.cart.findFirst({
    where: {
      user_id: userId
    }
  })

  if (!cartExist) {
    throw new ResponseError(404, "Cart not found")
  }

  const itemExist = await prismaClient.cartItem.findFirst({
    where: {
      id: itemId,
      cart_id: cartExist.id
    }
  })

  if (!itemExist) {
    throw new ResponseError(404, "Item not found")
  }

  const result = await prismaClient.cartItem.update({
    where: {
      id: itemId
    },
    data: {
      quantity: updateValidated.quantity
    }
  })

  return result
}

const removeCart = async (req) => {
  const userId = parseInt(req.user.id)
  const itemId = parseInt(req.params.item_id)

  const cartExist = await prismaClient.cart.findFirst({
    where: {
      user_id: userId
    }
  })

  if (!cartExist) {
    throw new ResponseError(404, "Cart not found")
  }

  const itemExist = await prismaClient.cartItem.findFirst({
    where: {
      id: itemId,
      cart_id: cartExist.id
    }
  })

  if (!itemExist) {
    throw new ResponseError(404, "Item not found")
  }
  
  const result = await prismaClient.cartItem.delete({
    where: {
      id: itemId
    }
  })

  return result
}


export default {
  createCart,
  getCart,
  updateCart,
  removeCart
}