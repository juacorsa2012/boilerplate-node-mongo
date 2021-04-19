const express = require('express')
const {autorizar, proteger} = require('../middlewares/auth')
const usuariosController = require('../controllers/usuarios')

const router = express.Router()

// router.get('/contar', [proteger, autorizar('admin', 'usuario')], contar)

router.get('/total', usuariosController.contarUsuarios)


/**
 * @api {get} http://localhost:5000/api/v1/usuarios Obtener Usuarios
 * @apiName ObtenerUsuarios
 * @apiGroup Usuarios
 *
 * @apiSuccess {String} status success
 * @apiSuccess {Number} results El número de usuarios 
 * @ApiSuccess {Object[]} data Array de usuarios
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "results": 1,
 *        "data": {
 *           "usuarios": [
 *           {
 *              "rol": "admin",
 *               "_id": "605db6fde4d5ce12ecc5af9c",
 *               "nombre": "usuario 1",
 *               "email": "email@test.com",
 *               "__v": 0
 *           }
 *       ]
 *   }
 *    
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 
 *     {
 *       "status": "error",
 *       "message": Mensaje de error 
 *     }
 */
router.get('/', usuariosController.obtenerUsuarios)


/**
 * @api {get} http://localhost:5000/api/v1/usuarios/:id Obtener Usuario
 * @apiName ObtenerUsuario
 * @apiGroup Usuarios
 *
 * @apiSuccess {String} status success
 * @ApiSuccess {Object[]} data Array usuario
 * 
 * @apiParam {String} id ID de usuario
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success", 
 *        "data": {
 *           "usuario": [
 *           {
 *              "rol": "admin",
 *               "_id": "605db6fde4d5ce12ecc5af9c",
 *               "nombre": "usuario 1",
 *               "email": "email@test.com",
 *               "__v": 0
 *           }
 *       ]
 *   }
 * 
 * @apiError NotFound Usuario no encontrado
 * 
 * @apiErrorExample Error 404:
 *    HTTP/1.1 404
 *    {
 *       "status": "error",
 *       "error": "Usuario no encontrado"
 *    }
 *    
 * @apiErrorExample Error 500:
 *     HTTP/1.1 500 
 *     {
 *       "status": "error",
 *       "message": "Error de servidor"
 *     }
 */
router.get('/:id', usuariosController.obtenerUsuario)

router.post('/', usuariosController.registrarUsuario)
router.delete('/:id', usuariosController.eliminarUsuario)
router.put('/:id', usuariosController.actualizarUsuario)
router.post('/login', usuariosController.loginUsuario)

module.exports = router