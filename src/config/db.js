require('colors')
const mongoose = require('mongoose')
const Message = require('../utils/message')

const conectarDB = () => {
  mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex : true,
    useFindAndModify  : false,
    useUnifiedTopology: true
  })
  .then(() => console.log(Message.CONEXION_BD_CORRECTA))
  .catch((err) => {
    console.log(`${err}`.red)
    process.exit(1)
  })  
}

module.exports = conectarDB