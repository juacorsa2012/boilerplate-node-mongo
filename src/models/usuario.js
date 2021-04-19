const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const Message = require('../utils/message')

const usuarioSchema = new mongoose.Schema(
{
    nombre: {
        type: String,             
        trim: true,
        required: [true, Message.NOMBRE_USUARIO_REQUERIDO]
    },    

    email: {
        type: String,
        required: [true, Message.EMAIL_USUARIO_REQUERIDO],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, Message.EMAIL_INCORRECTO]
    },

    password: {
        type: String,
        required: [true, Message.PASSWORD_USUARIO_REQUERIDO],
        minlength: [8, Message.PASSWORD_USUARIO_MINIMO],
        select: false       
    },
    
    rol: {
        type: String,
        enum: ['admin', 'usuario'],
        default: 'usuario'
    },   
    
    created_at: {
        type: Date,
        default: Date.now(),
        select: false
    }
})

usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
})

usuarioSchema.methods.esPasswordCorrecto = async function(bodyPassword, userPassword) {
    return await bcrypt.compare(bodyPassword, userPassword)
}

const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios')

module.exports = Usuario