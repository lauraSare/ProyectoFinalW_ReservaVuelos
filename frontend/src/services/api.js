import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
})

// Interceptor para adjuntar CSRF token en cada petición mutante
api.interceptors.request.use(config => {
  const metodosMutantes = ['post', 'put', 'delete', 'patch']
  if (metodosMutantes.includes(config.method)) {
    const token = axios.defaults.headers.common['x-csrf-token']
    if (token) {
      config.headers['x-csrf-token'] = token
    }
  }
  return config
})

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

// ==================== AUTH ====================
export const loginUsuario = (datos) => api.post('/auth/login', datos)
export const registroUsuario = (datos) => api.post('/auth/registro', datos)
export const logoutUsuario = () => api.post('/auth/logout')
export const getCsrfToken = () => api.get('/auth/csrf-token')

// ==================== DASHBOARD ====================
export const getEstadisticas = () => api.get('/dashboard/estadisticas')

// ==================== VUELOS ====================
export const getVuelos = () => api.get('/vuelos')
export const getVueloPorId = (id) => api.get(`/vuelos/${id}`)
export const crearVuelo = (datos) => api.post('/vuelos', datos)
export const actualizarVuelo = (id, datos) => api.put(`/vuelos/${id}`, datos)
export const eliminarVuelo = (id) => api.delete(`/vuelos/${id}`)

// ==================== PASAJEROS ====================
export const getPasajeros = () => api.get('/pasajeros')
export const getPasajeroPorId = (id) => api.get(`/pasajeros/${id}`)
export const crearPasajero = (datos) => api.post('/pasajeros', datos)
export const actualizarPasajero = (id, datos) => api.put(`/pasajeros/${id}`, datos)
export const eliminarPasajero = (id) => api.delete(`/pasajeros/${id}`)

// ==================== RESERVAS ====================
export const getReservas = () => api.get('/reservas')
export const getReservaPorId = (id) => api.get(`/reservas/${id}`)
export const crearReserva = (datos) => api.post('/reservas', datos)
export const actualizarReserva = (id, datos) => api.put(`/reservas/${id}`, datos)
export const eliminarReserva = (id) => api.delete(`/reservas/${id}`)

// ==================== TRIPULACION ====================
export const getTripulacion = () => api.get('/tripulacion')
export const getTripulantePorId = (id) => api.get(`/tripulacion/${id}`)
export const crearTripulante = (datos) => api.post('/tripulacion', datos)
export const actualizarTripulante = (id, datos) => api.put(`/tripulacion/${id}`, datos)
export const eliminarTripulante = (id) => api.delete(`/tripulacion/${id}`)
export const asignarVuelo = (id, datos) => api.post(`/tripulacion/${id}/vuelos`, datos)
export const quitarVuelo = (id, id_vuelo) => api.delete(`/tripulacion/${id}/vuelos/${id_vuelo}`)

// ==================== AUXILIARES ====================
export const getRutas = () => api.get('/rutas')
export const getAviones = () => api.get('/aviones')
export const getAsientos = () => api.get('/asientos')
export const getAsientosDisponibles = (id_vuelo) => api.get(`/asientos/disponibles/${id_vuelo}`)
export const getGrupos = () => api.get('/grupos')
export const crearGrupo = (datos) => api.post('/grupos', datos)
export const registrarPago = (datos) => api.post('/pagos', datos)

export default api
