// Verificar si el usuario está autenticado
const verificarSesion = (req, res, next) => {
  // Intentar obtener usuario de la sesión o del header
  if (req.session.usuario) {
    return next()
  }
  
  // Fallback: verificar usuario desde header x-usuario
  const usuarioHeader = req.headers['x-usuario']
  if (usuarioHeader) {
    try {
      req.session.usuario = JSON.parse(usuarioHeader)
      return next()
    } catch (e) {
      // invalid header
    }
  }
  
  return res.status(401).json({ mensaje: "No autorizado, inicia sesión primero" })
}

module.exports = { verificarSesion }