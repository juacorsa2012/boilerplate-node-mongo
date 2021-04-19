const SUCCESS = 'success'
const ERROR   = 'error'
const INTERNAL_SERVER_ERROR = 'Error de servidor'
const RECURSO_NO_ENCONTRADO = 'Recurso no encontrado'
const VALOR_DUPLICADO  = 'No se permiten valores duplicados en algunos de los campos introducidos'
const EMAIL_INCORRECTO = 'El email no tiene un formato válido'
const CREDENCIALES_INCORRECTAS = 'Las credenciales no son correctas'
const NO_AUTORIZADO = 'No dispones de los permisos necesarios para acceder al recurso solicitado'
const CONEXION_BD_CORRECTA = 'Conexión a la base de datos realizada con éxito'
const LIMITE_PETICIONES = 'Límite de peticiones alcanzado'

const USUARIO_REGISTRADO    = 'Usuario registrado con éxito'
const USUARIO_ACTUALIZADO   = 'Usuario actualizado con éxito'
const USUARIO_ELIMINADO     = 'Usuario eliminado con éxito'
const USUARIO_NO_ENCONTRADO = 'Usuario no encontrado'
const NOMBRE_USUARIO_REQUERIDO   = 'El nombre del usuario es requerido'
const EMAIL_USUARIO_REQUERIDO    = 'El email del usuario es requerido'
const PASSWORD_USUARIO_REQUERIDO = 'El password del usuario es requerido'
const PASSWORD_USUARIO_MINIMO    = 'El password del usuario debe tener al menos 8 caracteres'

module.exports = {
    SUCCESS,
    ERROR,
    INTERNAL_SERVER_ERROR,
    RECURSO_NO_ENCONTRADO,
    VALOR_DUPLICADO,
    EMAIL_INCORRECTO,
    CREDENCIALES_INCORRECTAS,
    NO_AUTORIZADO,
    CONEXION_BD_CORRECTA,
    LIMITE_PETICIONES,
    USUARIO_ACTUALIZADO,    
    USUARIO_ELIMINADO,
    USUARIO_NO_ENCONTRADO,
    USUARIO_REGISTRADO,
    NOMBRE_USUARIO_REQUERIDO,
    EMAIL_USUARIO_REQUERIDO,
    PASSWORD_USUARIO_REQUERIDO,
    PASSWORD_USUARIO_MINIMO
}
