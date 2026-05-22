import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import Login from '../views/Login.vue'
import Registro from '../views/Registro.vue'
import Dashboard from '../views/Dashboard.vue'
import Vuelos from '../views/Vuelos.vue'
import Pasajeros from '../views/Pasajeros.vue'
import Reservas from '../views/Reservas.vue'
import NotFound from '../views/NotFound.vue'
import Tripulacion from '../views/Tripulacion.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Rutas públicas
    { path: '/', component: LandingPage },
    { path: '/login', component: Login },
    { path: '/registro', component: Registro },

    // Rutas protegidas
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/vuelos', component: Vuelos, meta: { requiresAuth: true } },
    { path: '/pasajeros', component: Pasajeros, meta: { requiresAuth: true } },
    { path: '/reservas', component: Reservas, meta: { requiresAuth: true } },
    { path: '/tripulacion', component: Tripulacion, meta: { requiresAuth: true } },

    // Página 404
    { path: '/:pathMatch(.*)*', component: NotFound },
  ],
})

// Proteger rutas que requieren autenticación
router.beforeEach((to) => {
  const usuario = localStorage.getItem('usuario')
  if (to.meta.requiresAuth && !usuario) {
    return { path: '/login' }
  }
  // Si ya está autenticado y va a login o registro, redirigir al dashboard
  if ((to.path === '/' || to.path === '/login' || to.path === '/registro') && usuario) {
    return { path: '/dashboard' }
  }
})

export default router
