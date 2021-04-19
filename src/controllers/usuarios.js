const jwt = require('jsonwebtoken')
const { StatusCodes }  = require('http-status-codes')
const ErrorResponse = require('../utils/errorResponse')
const Message  = require('../utils/message')
const Usuario  = require('../models/usuario')
const Features = require('../utils/Features')
const asyncHandler = require('../middlewares/async')

const crearToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
  })
}

/**
 * @swagger
 *  components:
 *      schemas:
 *          Usuario:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                  nombre:
 *                      type: string
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *                  rol:
 *                      type: string 
 * 
 */

/**
 * @swagger
 * /api/v1/usuarios:
 *   get:
 *     summary: Recupera los usuarios registrados de la base de datos 
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Usuarios registrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                    type: string
 *                    example: success
 *                 results:
 *                    type: integer
 *                    description: Número de usuarios devueltos
 *                    example: 2 
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID del usuario
 *                         example: 60772adcba3881118493c794
 *                       nombre:
 *                         type: string
 *                         description: Nombre del usuario
 *                         example: Leanne Graham
 *                       email:
 *                          type: string
 *                          description: email del usuario
 *                          example: email@test.com 
 *                       rol:
 *                          type: string
 *                          description: Rol de usuario (admin o usuario)
 *                          example: admin 
 *  
 */
exports.obtenerUsuarios = asyncHandler(async (req, res) => {  
  const features = new Features(Usuario.find(), req.query)
      .filter()
      .sort()  
      .paginate()
  
    const usuarios = await features.query

    res.status(StatusCodes.OK).json({
      status : Message.SUCCESS,
      results: usuarios.length,
      data: usuarios 
    })      
})


/**
 * @swagger
 * /api/v1/usuarios/:
 *  post:
 *      summary: Registra un usuario 
 *      tags: [Usuarios]
 *      parameters:
 *          - in: body
 *            name: nombre
 *            required: true
 *            description: Nombre del usuario
 *            schema:
 *              type: string
 *          - in: body
 *            name: email
 *            required: true
 *            description: Email del usuario
 *            schema:
 *              type: string
 *          - in: body
 *            name: password
 *            required: true
 *            description: Password del usuario
 *            schema:
 *              type: string 
 *          - in: body
 *            name: rol
 *            required: true
 *            description: Rol del usuario (admin o usuario)
 *            schema:
 *              type: string 
 *  
 *      responses:
 *          200:
 *              description: Registra un usuario
 *              content:
 *                  application/json:
 *                      schema:             
 *                        type: object
 *                        properties:
 *                          status:
 *                            type: string
 *                            example: success
 *                          message:
 *                            type: string
 *                            example: Usuario registrado con éxito
 *                          token:
 *                            type: string
 *                            example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNzk0YWJmY2EzZDg4MGNhNDFmNWNmMiIsImlhdCI6MTYxODU2MTcyNywiZXhwIjoxNjE4NjQ4MTI3fQ.k0FR2AB3bWThe8hQdPbmmb6KPwo874jT5SIjoD5EBTQ  
 * 
 *          400:
 *            description: Error al crear un nuevo usuario
 *            content:
 *                application/json:  
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: error
 *                      error:
 *                        type: string
 *                        example: El nombre del usuario es requerido
 *                          
 *          500:
 *            description: Error de servidor 
 *            content:
 *                application/json:  
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: error
 *                      error:
 *                        type: string
 *                        example: Error de servidor                          
 */

exports.registrarUsuario = asyncHandler(async (req, res) => {  
  const { nombre, email, password, rol } = req.body        
  const usuario = await Usuario.create({nombre, email, password, rol})
  const token = crearToken(usuario._id)

  res.status(StatusCodes.CREATED).json({
    status : Message.SUCCESS,
    message: Message.USUARIO_REGISTRADO,
    token
  })    
})


/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *  get:
 *      summary: Devuelve un usuario 
 *      tags: [Usuarios]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: string id required
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Devuelve un usuario
 *              content:
 *                  application/json:
 *                      schema:             
 *                        type: object
 *                        properties:
 *                          status:
 *                            type: string
 *                            example: success
 *                          data:                            
 *                            items:
 *                              type: object
 *                            properties:
 *                              _id:
 *                                type: string
 *                                description: ID del usuario
 *                                example: 60772adcba3881118493c794
 *                              nombre:
 *                                type: string
 *                                description: Nombre del usuario
 *                                example: Leanne Graham
 *                              email:
 *                                type: string
 *                                description: email del usuario
 *                                example: email@test.com 
 *                              rol:
 *                                type: string
 *                                description: Rol de usuario (admin o usuario)
 *                                example: admin                           
 *          404:
 *            description: Usuario no encontrado
 *            content:
 *                application/json:  
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: error
 *                      error:
 *                        type: string
 *                        example: Usuario no encontrado
 *                          
 *          500:
 *            description: Error de servidor 
 *            content:
 *                application/json:  
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: error
 *                      error:
 *                        type: string
 *                        example: Error de servidor                          
 */
exports.obtenerUsuario = asyncHandler(async (req, res, next) => {
  const usuario = await Usuario.findById(req.params.id)

  if (!usuario) {
    return next(new ErrorResponse(Message.USUARIO_NO_ENCONTRADO, StatusCodes.NOT_FOUND))
  }
    
  res.status(StatusCodes.OK).json({
    status : Message.SUCCESS,
    data: usuario 
  })    
})

exports.actualizarUsuario = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const usuario = await Usuario.findById(id)

  if (!usuario) {
    next(new ErrorResponse(Message.USUARIO_NO_ENCONTRADO, StatusCodes.NOT_FOUND))
  }

  await Usuario.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
  
  res.status(StatusCodes.OK).json({
    status : Message.SUCCESS,
    message: Message.USUARIO_ACTUALIZADO
  })      
})


/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *  delete:
 *      summary: Borra un usuario 
 *      tags: [Usuarios]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: string id required
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Borra un usuario
 *              content:
 *                  application/json:
 *                      schema:             
 *                        type: object
 *                        properties:
 *                          status:
 *                            type: string
 *                            example: success
 *                          message:
 *                            type: string
 *                            example: Usuario eliminado con éxito   
 *          404:
 *            description: Usuario no encontrado
 *            content:
 *                application/json:  
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: error
 *                      error:
 *                        type: string
 *                        example: Usuario no encontrado
 *                          
 *          500:
 *            description: Error de servidor 
 *            content:
 *                application/json:  
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: error
 *                      error:
 *                        type: string
 *                        example: Error de servidor                          
 */
exports.eliminarUsuario = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const usuario = await Usuario.findById(id)

  if (!usuario) {
    next(new ErrorResponse(Message.USUARIO_NO_ENCONTRADO, StatusCodes.NOT_FOUND))
  }

  await Usuario.findByIdAndDelete(id)

  res.status(StatusCodes.OK).json({
    status : Message.SUCCESS,
    message: Message.USUARIO_ELIMINADO
  })
})

exports.loginUsuario = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {        
    return next(new ErrorResponse(Message.CREDENCIALES_INCORRECTAS, StatusCodes.BAD_REQUEST))
  }

  const usuario = await Usuario.findOne({ email }).select('+password')

  if (!usuario || !(await usuario.esPasswordCorrecto(password, usuario.password)))
  {        
    return next(new ErrorResponse(Message.CREDENCIALES_INCORRECTAS, StatusCodes.UNAUTHORIZED))
  }    
  
  const token = crearToken(usuario._id);

  res.status(StatusCodes.OK).json({ 
      status: Message.SUCCESS,
      token 
  })
}

exports.contarUsuarios = asyncHandler(async (req, res) => {
  const usuarios = await Usuario.countDocuments()
  
  res.status(StatusCodes.OK).json({
    status : Message.SUCCESS,
    results: usuarios    
  })    
})  