import imageService from '../service/image-service.js'

const upload = async (req, res, next) => {
  try {
    const result = await imageService.uploadImage(req)
    res.status(201).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const get = async (req, res, next) => {
  try {
    const result = await imageService.getAll(req)
    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const result = await imageService.update(req)
    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const result = await imageService.remove(req)
    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export default {
  upload,
  get,
  update,
  remove
}