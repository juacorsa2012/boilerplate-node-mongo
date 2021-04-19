const { StatusCodes }  = require('http-status-codes')
const ErrorResponse = require('../utils/errorResponse')
const Message = require('../utils/message')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }

  error.message = err.message
    
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {    
    error = new ErrorResponse(Message.RECURSO_NO_ENCONTRADO, StatusCodes.BAD_REQUEST)
  }

  // Mongoose duplicate key
  if (err.code === 11000) {    
    error = new ErrorResponse(Message.VALOR_DUPLICADO, StatusCodes.BAD_REQUEST)
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, StatusCodes.BAD_REQUEST)
  }

  res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: Message.ERROR,
    error: error.message || Message.INTERNAL_SERVER_ERROR
  })
}

module.exports = errorHandler