const jwt = require('jsonwebtoken')
const { StatusCodes }  = require('http-status-codes')
const ErrorResponse = require('../utils/errorResponse')
const Usuario = require('../models/usuario')
const Message = require('../utils/message')

exports.proteger = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new ErrorResponse(Message.NO_AUTORIZADO, StatusCodes.UNAUTHORIZED))
  }

  try {    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = await Usuario.findById(decoded.id)
    next()
  } catch (err) {
    return next(new ErrorResponse(Message.NO_AUTORIZADO, StatusCodes.UNAUTHORIZED))
  }
}

exports.autorizar = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return next(
        new ErrorResponse(Message.NO_AUTORIZADO, StatusCodes.UNAUTHORIZED))
    }
    next()
  }
}
