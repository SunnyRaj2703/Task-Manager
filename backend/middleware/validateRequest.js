import { validationResult } from "express-validator"

const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({ field: error.param, message: error.msg }))
    return res.status(400).json({
      success: false,
      message: formattedErrors[0].message,
      errors: formattedErrors,
    })
  }
  next()
}

export default validateRequest
