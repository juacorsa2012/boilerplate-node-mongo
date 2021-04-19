const { StatusCodes } = require('http-status-codes')
const mongoose  = require('mongoose')
const supertest = require('supertest')
const server    = require('../../src/server')
const Usuario   = require('../../src/models/usuario')
const Message   = require('../../src/utils/message')
const api = supertest(server)

let idUsuario1

const usuarios = [
    {
        "nombre"  : "usuario 1",
        "password": "12345678",
        "email"   : "email1@test.com",
        "rol": "admin"
    },
    {
        "nombre"  : "usuario 2",
        "password": "12345678",
        "email"   : "email2@test.com",
        "rol": "usuario"
    }
]

beforeEach(async () => {
    await Usuario.deleteMany({})

    const usuario1 = new Usuario(usuarios[0])
    const usuario2 = new Usuario(usuarios[1])

    await usuario1.save()
    await usuario2.save()

    idUsuario1 = usuario1._id
})

test('debe devolver los usuarios como json', async () => {
    await api
        .get('/api/v1/usuarios')
        .expect(StatusCodes.OK)
        .expect('Content-Type', /application\/json/)
})

test('debe haber 2 usuarios', async () => {
    const res = await api.get('/api/v1/usuarios')

    expect(res.body.data).toHaveLength(usuarios.length)
    expect(res.body.results).toBe(usuarios.length)
    expect(res.body.status).toBe(Message.SUCCESS)
})

test('debe registrar un usuario valido', async () => {
    const usuario = {
        "nombre"  : "usuario 3",
        "password": "12345678",
        "email"   : "email3@test.com",
        "rol": "admin"        
    }

    const res = await api.post('/api/v1/usuarios').send(usuario)   
    
    expect(res.statusCode).toBe(StatusCodes.CREATED)
    expect(res.body.status).toBe(Message.SUCCESS)      
    expect(res.body.message).toBe(Message.USUARIO_REGISTRADO)
})

test("debe devolver un error 400 cuando no se facilita el nombre del usuario", async () => {
    const usuario = {
        "password": "12345678",
        "email"   : "email3@test.com",
        "rol": "admin"        
    }

    const res = await api.post('/api/v1/usuarios').send(usuario)       

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Message.ERROR)    
    expect(res.body.error).toBe(Message.NOMBRE_USUARIO_REQUERIDO)
})

test("debe devolver un error 400 cuando no se facilita el password del usuario", async () => {
    const usuario = {
        "nombre": "usuario",
        "email" : "email3@test.com",
        "rol": "admin"        
    }

    const res = await api.post('/api/v1/usuarios').send(usuario)       

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Message.ERROR)    
    expect(res.body.error).toBe(Message.PASSWORD_USUARIO_REQUERIDO)
})

test("debe devolver un error 400 cuando no se facilita el email del usuario", async () => {
    const usuario = {
        "nombre": "usuario",
        "password": "12345678",
        "rol": "admin"        
    }

    const res = await api.post('/api/v1/usuarios').send(usuario)       

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Message.ERROR)    
    expect(res.body.error).toBe(Message.EMAIL_USUARIO_REQUERIDO)
})

test("debe devolver un error 400 cuando el email del usuario no es un email válido", async () => {
    const usuario = {
        "nombre": "usuario",
        "password": "12345678",
        "email": "email",
        "rol": "admin"        
    }

    const res = await api.post('/api/v1/usuarios').send(usuario)       

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Message.ERROR)    
    expect(res.body.error).toBe(Message.EMAIL_INCORRECTO)
})

test("debe devolver un error 400 cuando el email del usuario ya existe", async () => {
    const usuario = {
        "nombre"  : "usuario",
        "password": "12345678",
        "email"   : "email2@test.com",
        "rol": "admin"        
    }

    const res = await api.post('/api/v1/usuarios').send(usuario)       

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Message.ERROR)    
    expect(res.body.error).toBe(Message.VALOR_DUPLICADO)
})

test("debe devolver un error 400 cuando el rol del usuario no es un rol permitido", async () => {
    const usuario = {
        "nombre"  : "usuario",
        "password": "12345678",
        "email"   : "email2@test.com",
        "rol": "rol"        
    }

    const res = await api.post('/api/v1/usuarios').send(usuario)       

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Message.ERROR)        
})

test("debe devolver un error 400 cuando el password del usuario es inferior a 8 caracteres", async () => {
    const usuario = {
        "nombre"  : "usuario",
        "password": "123456",
        "email"   : "email@test.com",
        "rol": "admin"        
    }

    const res = await api.post('/api/v1/usuarios').send(usuario)       

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Message.ERROR) 
    expect(res.body.error).toBe(Message.PASSWORD_USUARIO_MINIMO)
})

test("debe devolver un usuario", async () => {
    const res = await api.get(`/api/v1/usuarios/${idUsuario1}`)

    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Message.SUCCESS) 
    expect(res.body.data.nombre).toBe(usuarios[0].nombre)
    expect(res.body.data.email).toBe(usuarios[0].email)
    expect(res.body.data.rol).toBe(usuarios[0].rol)
})

test("debe devolver un error 404 si el usuario no existe", async () => {
    const res = await api.get('/api/v1/usuarios/60702045952d2c132cd68dcd')

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND)
    expect(res.body.status).toBe(Message.ERROR)   
    expect(res.body.error).toBe(Message.USUARIO_NO_ENCONTRADO)       
})

test("debe devolver un error 404 si el usuario no existe al pasar un id mal formado", async () => {
    const res = await api.get('/api/v1/usuarios/1')

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Message.ERROR)  
    expect(res.body.error).toBe(Message.RECURSO_NO_ENCONTRADO)   
})

test("debe borrar un usuario", async () => {
    const res = await api.delete(`/api/v1/usuarios/${idUsuario1}`)

    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Message.SUCCESS) 
    expect(res.body.message).toBe(Message.USUARIO_ELIMINADO)       
})

test("debe devolver un error 404 al borrar un usuario que no existe", async () => {
    const res = await api.delete(`/api/v1/usuarios/60702045952d2c132cd68dcd`)

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND)
    expect(res.body.status).toBe(Message.ERROR) 
    expect(res.body.error).toBe(Message.USUARIO_NO_ENCONTRADO)
})

test("debe devolver un error 400 al borrar un usuario con un id mal formado", async () => {
    const res = await api.delete(`/api/v1/usuarios/1`)

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Message.ERROR) 
})


test("debe actualizar un usuario", async () => {
    const usuario = {
        "nombre"  : "usuario 3",
        "password": "password",
        "email"   : "email3@test.com",
        "rol": "admin"        
    }    
    
    const res = await api.put(`/api/v1/usuarios/${idUsuario1}`).send(usuario)

    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Message.SUCCESS) 
    expect(res.body.message).toBe(Message.USUARIO_ACTUALIZADO)
})

test("debe devolver un error 404 al actualizar un usuario que no existe", async () => {
    const usuario = {
        "nombre"  : "usuario 3",
        "password": "password",
        "email"   : "email3@test.com",
        "rol": "admin"        
    }    
    
    const res = await api.put(`/api/v1/usuarios/60702045952d2c132cd68dcd`).send(usuario)

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND)
    expect(res.body.status).toBe(Message.ERROR) 
    expect(res.body.error).toBe(Message.USUARIO_NO_ENCONTRADO)
})

test("debe devolver un error 400 al actualizar un usuario sin nombre", async () => {
    const usuario = {
        "nombre": "",
        "password": "password",
        "email"   : "email3@test.com",
        "rol": "admin"        
    }    
    
    const res = await api.put(`/api/v1/usuarios/${idUsuario1}`).send(usuario)

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Message.ERROR)  
    expect(res.body.error).toBe(Message.NOMBRE_USUARIO_REQUERIDO)
})

test("debe devolver un error 400 al actualizar un usuario sin password", async () => {
    const usuario = {
        "nombre": "usuario 6666",
        "password": "",
        "email"   : "email3@test.com",
        "rol": "admin"        
    }    
    
    const res = await api.put(`/api/v1/usuarios/${idUsuario1}`).send(usuario)

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Message.ERROR)  
    expect(res.body.error).toBe(Message.PASSWORD_USUARIO_REQUERIDO)
})

test("debe devolver un error 400 al actualizar un usuario sin email", async () => {
    const usuario = {
        "nombre": "usuario 6666",
        "password": "password",
        "email"   : "",
        "rol": "admin"        
    }    
    
    const res = await api.put(`/api/v1/usuarios/${idUsuario1}`).send(usuario)

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Message.ERROR)  
    expect(res.body.error).toBe(Message.EMAIL_USUARIO_REQUERIDO)
})

test("debe devolver un error 400 al actualizar un usuario sin rol", async () => {
    const usuario = {
        "nombre": "usuario 6666",
        "password": "password",
        "email"   : "hola2test.com",
        "rol": ""        
    }    
    
    const res = await api.put(`/api/v1/usuarios/${idUsuario1}`).send(usuario)

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Message.ERROR)      
})

test("debe devolver un error 400 al actualizar un usuario con un email no válido", async () => {
    const usuario = {
        "nombre": "usuario 6666",
        "password": "password",
        "email"   : "email",
        "rol": "admin"        
    }    
    
    const res = await api.put(`/api/v1/usuarios/${idUsuario1}`).send(usuario)

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Message.ERROR)  
    expect(res.body.error).toBe(Message.EMAIL_INCORRECTO)
})

test("debe devolver un error 400 al actualizar un usuario con un password inferior a 8 caracteres", async () => {
    const usuario = {
        "nombre": "usuario 6666",
        "password": "123456",
        "email"   : "email@test.com",
        "rol": "admin"        
    }    
    
    const res = await api.put(`/api/v1/usuarios/${idUsuario1}`).send(usuario)

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Message.ERROR)  
    expect(res.body.error).toBe(Message.PASSWORD_USUARIO_MINIMO)    
})

test("debe devolver el números de usuarios registrados", async () => {    
    const res = await api.get('/api/v1/usuarios/total')

    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Message.SUCCESS)
    expect(res.body.results).toBe(usuarios.length)  
})

afterAll(() => {    
    mongoose.connection.close()
    server.close()    
})