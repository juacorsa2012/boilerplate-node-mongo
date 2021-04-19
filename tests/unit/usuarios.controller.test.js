const httpMocks = require("node-mocks-http")
const UsuariosController = require('../../src/controllers/usuarios')
const Usuario = require('../../src/models/usuario')
const usuario = require('./mock-data/usuario.json')

Usuario.create = jest.fn()
Usuario.find = jest.fn()

let req, res, next

beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = null;
})

test("debe existir una funcion llamada registrarUsuario", () => {
    expect(typeof UsuariosController.registrarUsuario).toBe("function")
})













it.skip("debe existir una llamada a UsuariosController.registrarUsuario", () => {
    req.body = usuario
    UsuariosController.registrarUsuario(req, res)
    expect(UsuariosController.registrarUsuario).toBeCalledWith(usuario)
})

it.skip("201", () => {
  Usuario.create.mockReturnValue(usuario)
  UsuariosController.registrarUsuario(req, res)
  expect(res._getJSONData()).toBe(usuario)
  
})








test("debe existir una funcion llamada obtenerUsuarios", () => {
  expect(typeof UsuariosController.obtenerUsuarios).toBe("function")
})

test("debe existir una funcion llamada obtenerUsuario", () => {
  expect(typeof UsuariosController.obtenerUsuario).toBe("function")
})

test("debe existir una funcion llamada actualizarUsuario", () => {
  expect(typeof UsuariosController.actualizarUsuario).toBe("function")
})

test("debe existir una funcion llamada eliminarUsuario", () => {
  expect(typeof UsuariosController.eliminarUsuario).toBe("function")
})

test("debe existir una funcion llamada loginUsuario", () => {
  expect(typeof UsuariosController.loginUsuario).toBe("function")
})

test("debe existir una funcion llamada contarUsuarios", () => {
  expect(typeof UsuariosController.contarUsuarios).toBe("function")
})

