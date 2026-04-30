import { prismaClient } from "../app/database.js"
import { ResponseError } from "../error/response-error.js"
import { cloudinary } from "../utils/cloudinary.js"
import { updateImageValidation, uploadImageValidation } from "../validation/image-validation.js"
import { validate } from "../validation/validation.js"

const uploadImage = async (req) => {
  const userId = parseInt(req.user.id)
  const productId = parseInt(req.params.id)
  const imageValidated = validate(uploadImageValidation, req.body)

  const productExist = await prismaClient.product.findFirst({
    where: {
      id: productId
    }
  })

  if (!productExist) {
    throw new ResponseError(404, "Product not found")
  }

  if (productExist.user_id !== userId) {
    throw new ResponseError(401, "Can't upload image for this product")
  }

  let imageUrl = req.file

  if (!imageUrl) {
    throw new ResponseError(404, "Url not found")
  }

  imageUrl = imageUrl.path

  if (imageValidated.is_primary === true) {
    const isPrimary = await prismaClient.image.findFirst({
      where: {
        product_id: productId,
        is_primary: true
      }
    })

    if (isPrimary) {
      throw new ResponseError(401, "Image cant be a primary image")
    }
  }

  const createImage = await prismaClient.image.create({
    data: {
      product_id: productId,
      is_primary: imageValidated.is_primary,
      image_url: imageUrl
    }
  })

  return createImage
}

const getAll = async (req) => {
  const productId = parseInt(req.params.id)
  const productExist = await prismaClient.product.findFirst({
    where: {
      id: productId
    }
  })

  if (!productExist) {
    throw new ResponseError(404, "Product not found")
  }

  const result = await prismaClient.image.findMany({
    where: {
      product_id:productId
    }
  })

  return result
}

const update = async (req) => {
  const productId = parseInt(req.params.id)
  const userId = parseInt(req.user.id)
  const imageId = parseInt(req.params.image_id)
  const updateValidated = validate(updateImageValidation, req.body)

  const productExist = await prismaClient.product.findFirst({
    where: {
      id: productId
    }
  })

  if (!productExist) {
    throw new ResponseError(404, "Product not found")
  }

  if (productExist.user_id !== userId) {
    throw new ResponseError(401, "cant update images")
  }

  const imageExist = await prismaClient.image.findFirst({
    where: {
      id: imageId,
      product_id: productId
    }
  })

  if (!imageExist) {
    throw new ResponseError(404, "Image not found")
  }

  if (updateValidated.is_primary === false && imageExist.is_primary === true) {
    throw new ResponseError(401, "cant update image")
  } 

  if (updateValidated.is_primary === true) {
    await prismaClient.$transaction([
      prismaClient.image.updateMany({
        where: {
          product_id: productId, is_primary: true
        },
        data: {
          is_primary: false
        }
        
      }),
      prismaClient.image.update({
        where: {
          id: imageId
        },
        data: {
          is_primary: true
        }
      })
    ])

    const result = await prismaClient.image.findFirst({
      where: {
        id: imageId
      }
    })

    return result
  }

}

const remove = async (req) => {
   const productId = parseInt(req.params.id)
  const userId = parseInt(req.user.id)
  const imageId = parseInt(req.params.image_id)

  const productExist = await prismaClient.product.findFirst({
    where: {
      id: productId
    }
  })

  if (!productExist) {
    throw new ResponseError(404, "Product not found")
  }

  if (productExist.user_id !== userId) {
    throw new ResponseError(401, "cant delete image")
  }

  const imageExist = await prismaClient.image.findFirst({
    where: {
      id: imageId,
      product_id: productId
    }
  })

  if (!imageExist) {
    throw new ResponseError(404, "Image not found")
  }

  if (imageExist.is_primary === true) {
    throw new ResponseError(401, "Cant delete image")
  } 

  const publicId = `uploads/${imageExist.image_url.split("/").pop().split(".")[0]}`
  await cloudinary.uploader.destroy(publicId)
  const result = await prismaClient.image.delete({
    where: {
      id: imageId
    }
  })
  return result
}

export default {
  uploadImage,
  getAll,
  update,
  remove
}