const { StatusCodes }  = require('http-status-codes')
const express = require('express')
const cors = require('cors');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
const errorHandler = require('./middlewares/error')
const conectarDB = require('./config/db')
const Message = require('./utils/message')
const usuarioRoutes = require('./routes/usuarios')


const logger = require('./middlewares/logger')


const PETICIONES = 100
const app = express()

const limiter = rateLimit({
  max: PETICIONES,
  windowMs: 60 * 60 * 1000,
  message: Message.LIMITE_PETICIONES
})

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
      openapi : '3.0.0',
      info : {
          title: 'NodeJS + MongoDB boilerplate',
          version: '1.0.0'
      },
      servers:[
          {
            url: 'http://localhost:5000/'
          }
      ]
  },
  apis: ['./src/controllers/*.js'],
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(express.json())
app.use(cors())
app.use('/api/v1/', limiter)
app.use(helmet())
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())
app.use(logger)

conectarDB()

app.use('/api/v1/usuarios', usuarioRoutes)


app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Imposible encontrar ${req.originalUrl} en este servidor!`, StatusCodes.NOT_FOUND))
})

app.use(errorHandler)

module.exports = app