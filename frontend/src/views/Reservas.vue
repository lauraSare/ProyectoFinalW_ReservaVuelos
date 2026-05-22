<template>
    <div class="dashboard">
        <!-- Sidebar -->
        <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
            <div class="sidebar-header">
                <router-link to="/" class="sidebar-brand">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="24"
                        height="24">
                        <path d="M22 16.5H2l4-9h12l4 9z" />
                        <path d="M6 16.5l1.5 3h9l1.5-3" />
                        <path d="M12 7.5V4m0 0l-2 2m2-2l2 2" />
                    </svg>
                    <span v-if="!sidebarCollapsed">Quetzal</span>
                </router-link>
                <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
            </div>
            <nav class="sidebar-nav">
                <router-link to="/dashboard" class="nav-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20"
                        height="20">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    <span v-if="!sidebarCollapsed">Dashboard</span>
                </router-link>
                <router-link to="/vuelos" class="nav-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20"
                        height="20">
                        <path d="M22 2L11 13" />
                        <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                    </svg>
                    <span v-if="!sidebarCollapsed">Vuelos</span>
                </router-link>
                <router-link to="/pasajeros" class="nav-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20"
                        height="20">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span v-if="!sidebarCollapsed">Pasajeros</span>
                </router-link>
                <router-link to="/reservas" class="nav-item active">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20"
                        height="20">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <span v-if="!sidebarCollapsed">Reservas</span>
                </router-link>
                <router-link to="/tripulacion" class="nav-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20"
                        height="20">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span v-if="!sidebarCollapsed">Tripulación</span>
                </router-link>
            </nav>
            <div class="sidebar-footer" v-if="!sidebarCollapsed">
                <div class="user-info">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32"
                        height="32">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <div>
                        <span class="user-name">{{ usuario?.nombre }}</span>
                        <span class="user-role">Administrador</span>
                    </div>
                </div>
                <button class="btn-logout" @click="handleLogout">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18"
                        height="18">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Cerrar Sesión
                </button>
            </div>
        </aside>
        <!-- Contenido principal -->
        <main class="main-content">
            <header class="topbar">
                <h1 class="page-title">Reservas</h1>
                <div class="session-timer" :class="{ 'timer-warning': timerWarning }">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14"
                        height="14">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {{ tiempoSesion }}
                </div>
                <div class="topbar-right">
                    <span class="welcome-text">Bienvenido, <strong>{{ usuario?.nombre }}</strong></span>
                </div>
            </header>
            <div class="reservas-page">
                <!-- Header -->
                <div class="page-header animate-fade-up">
                    <div class="page-header-left">
                        <div class="page-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26"
                                height="26">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                        </div>
                        <div>
                            <h2 class="section-title">Gestión de Reservas</h2>
                            <p class="page-subtitle">Reservas registradas en el sistema</p>
                        </div>
                    </div>
                    <button class="btn-primary" @click="abrirModalCrear">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"
                            height="18">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Nueva Reserva
                    </button>
                </div>
                <!-- Tabla -->
                <div class="table-card animate-fade-up" style="animation-delay: 0.1s">
                    <div class="table-responsive">
                        <table id="tablaReservas" class="quetzal-table" style="width:100%">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Pasajero</th>
                                    <th>Vuelo</th>
                                    <th>Grupo</th>
                                    <th>Pago</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
                <!-- Modal Crear / Editar -->
                <div class="modal-overlay" v-if="mostrarModal" @click.self="cerrarModal">
                    <div class="modal-box animate-fade-up">
                        <div class="modal-header">
                            <div class="modal-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="22"
                                    height="22">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                            </div>
                            <h2 class="modal-title">{{ modoEdicion ? 'Editar Reserva' : 'Nueva Reserva' }}</h2>
                            <button class="modal-close" @click="cerrarModal">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20"
                                    height="20">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Pasajero <span class="label-readonly" v-if="modoEdicion">— no
                                            editable</span></label>
                                    <div v-if="modoEdicion" class="input-wrapper input-readonly">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                                            width="16" height="16">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <span class="readonly-text">{{ pasajeroNombre }}</span>
                                    </div>
                                    <div v-else class="input-wrapper select-wrapper">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                                            width="16" height="16">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <select v-model="form.id_pasajero">
                                            <option value="" disabled>Selecciona un pasajero</option>
                                            <option v-for="p in pasajeros" :key="p.id_pasajero" :value="p.id_pasajero">
                                                {{ p.nombre }} {{ p.primer_apellido }} — {{ p.num_pasaporte }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Vuelo <span class="label-readonly" v-if="modoEdicion">— no
                                            editable</span></label>
                                    <div v-if="modoEdicion" class="input-wrapper input-readonly">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                                            width="16" height="16">
                                            <path d="M22 2L11 13" />
                                            <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                                        </svg>
                                        <span class="readonly-text">{{ vueloNombre }}</span>
                                    </div>
                                    <div v-else class="input-wrapper select-wrapper">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                                            width="16" height="16">
                                            <path d="M22 2L11 13" />
                                            <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                                        </svg>
                                        <select v-model="form.id_vuelo">
                                            <option value="" disabled>Selecciona un vuelo</option>
                                            <option v-for="v in vuelos" :key="v.id_vuelo" :value="v.id_vuelo">
                                                {{ v.codigo_vuelo }} — {{ formatFecha(v.fecha_salida) }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- === TIPO DE RESERVA === -->
                            <div class="form-row" v-if="!modoEdicion">
                                <div class="form-group">
                                    <label>Tipo de Reserva</label>
                                    <div class="input-wrapper select-wrapper">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                            <circle cx="9" cy="7" r="4"/>
                                        </svg>
                                        <select v-model="form.tipo_reserva">
                                            <option value="Reserva individual">Individual — Solo un pasajero</option>
                                            <option value="Reserva familiar">Familiar — Grupo familiar</option>
                                            <option value="Reserva grupal">Grupal — Grupo de personas</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- === GRUPO DE RESERVA (Nuevo) === -->
                            <div class="form-row" v-if="!modoEdicion">
                                <div class="form-group">
                                    <label>Grupo de Reserva (Opcional)</label>
                                    <div class="input-wrapper select-wrapper">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                            <circle cx="9" cy="7" r="4"/>
                                        </svg>
                                        <select v-model="form.id_grupo">
                                            <option value="">Nueva reserva individual</option>
                                            <option v-for="g in grupos" :key="g.id_grupo" :value="g.id_grupo">
                                                Grupo #{{ g.id_grupo }} — {{ g.descripcion || 'Sin descripción' }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="form-row" v-if="!modoEdicion">
                                <div class="form-group">
                                    <label>Asiento</label>
                                    <div class="input-wrapper select-wrapper">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                                            width="16" height="16">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <path d="M9 9h6M9 12h6M9 15h4" />
                                        </svg>
                                        <select v-model="form.id_asiento">
                                            <option value="" disabled>Selecciona un asiento</option>
                                            <option v-for="a in asientos" :key="a.id_asiento" :value="a.id_asiento">
                                                {{ a.numero_asiento }} — {{ a.clase }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Precio</label>
                                    <div class="input-wrapper">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                                            width="16" height="16">
                                            <line x1="12" y1="1" x2="12" y2="23" />
                                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                        </svg>
                                        <input type="number" v-model="form.precio" placeholder="Selecciona un asiento"
                                            min="0" step="0.01" readonly style="cursor:default; opacity:0.8;" />
                                    </div>
                                </div>
                            </div>
                            <div class="form-row" v-if="modoEdicion">
                                <div class="form-group">
                                    <label>Grupo <span class="label-readonly">— no editable</span></label>
                                    <div class="input-wrapper input-readonly">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                            <circle cx="9" cy="7" r="4"/>
                                        </svg>
                                        <span class="readonly-text">{{ form.id_grupo ? 'Grupo #' + form.id_grupo : 'Individual' }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="form-row" v-if="modoEdicion">
                                <div class="form-group">
                                    <label>Estado</label>
                                    <div class="input-wrapper select-wrapper">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                                            width="16" height="16">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <select v-model="form.estado">
                                            <option value="en_espera">En espera</option>
                                            <option value="confirmada">Confirmada</option>
                                            <option value="cancelada">Cancelada</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="error-msg" v-if="error">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16"
                                    height="16">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {{ error }}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn-secondary" @click="cerrarModal">Cancelar</button>
                            <button class="btn-primary" @click="guardarReserva" :disabled="loading">
                                <svg v-if="!loading" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" width="16" height="16">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                {{ loading ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear Reserva') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Pago -->
            <div class="modal-overlay" v-if="mostrarModalPago" @click.self="cerrarModalPago">
                <div class="modal-box animate-fade-up" style="max-width:480px">
                    <div class="modal-header">
                        <div class="modal-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="22" height="22">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                <line x1="1" y1="10" x2="23" y2="10"/>
                            </svg>
                        </div>
                        <h2 class="modal-title">Registrar Pago — Grupo #{{ grupoPagando }}</h2>
                        <button class="modal-close" @click="cerrarModalPago">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Método de Pago</label>
                            <div class="input-wrapper select-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                    <line x1="1" y1="10" x2="23" y2="10"/>
                                </svg>
                                <select v-model="metodoPago">
                                    <option value="tarjeta">Tarjeta</option>
                                    <option value="transferencia">Transferencia bancaria</option>
                                    <option value="puntos">Millas</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" @click="cerrarModalPago">Cancelar</button>
                        <button class="btn-primary" @click="registrarPago" :disabled="loadingPago">
                            <svg v-if="!loadingPago" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            {{ loadingPago ? 'Procesando...' : 'Confirmar Pago' }}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getReservas, crearReserva, actualizarReserva, eliminarReserva, getPasajeros, getVuelos, getAsientosDisponibles, getGrupos, registrarPago as registrarPagoAPI, logoutUsuario } from '../services/api'
import api from '../services/api'

const router = useRouter()

const usuario = ref(null)
const sidebarCollapsed = ref(false)
const reservas = ref([])
const pasajeros = ref([])
const vuelos = ref([])
const asientos = ref([])
const grupos = ref([])
const mostrarModal = ref(false)
const modoEdicion = ref(false)
const loading = ref(false)
const error = ref('')
const reservaEditandoId = ref(null)
const tiempoSesion = ref('5:00')
const timerWarning = ref(false)
const mostrarModalPago = ref(false)
const grupoPagando = ref(null)
const metodoPago = ref('tarjeta')
const montoPago = ref(0)
const loadingPago = ref(false)

const onSessionTimer = (e) => {
    tiempoSesion.value = e.detail
    const [m, s] = e.detail.split(':').map(Number)
    timerWarning.value = m === 0
    if (m === 0 && s === 0) {
        window.Swal.fire({
            icon: 'warning',
            title: '¡Sesión expirada!',
            text: 'Tu sesión ha terminado. Por favor inicia sesión nuevamente.',
            background: '#1a0c10',
            color: '#f0e8e0',
            confirmButtonColor: '#c9a84c',
            confirmButtonText: 'Ir al login'
        }).then(() => {
            localStorage.removeItem('usuario')
            router.push('/')
        })
    }
}

const formVacio = () => ({
    id_pasajero: '',
    id_vuelo: '',
    id_asiento: '',
    precio: '',
    estado: 'en_espera',
    id_grupo: '',
    tipo_reserva: 'Reserva individual'
})
const form = ref(formVacio())

const preciosPorClase = {
    'turista': 1500,
    'ejecutiva': 3500,
    'primera_clase': 6000
}

watch(() => form.value.id_vuelo, async (nuevoId) => {
    form.value.id_asiento = ''
    form.value.precio = ''
    if (nuevoId) {
        try {
            const res = await getAsientosDisponibles(nuevoId)
            asientos.value = res.data
        } catch {
            asientos.value = []
        }
    } else {
        asientos.value = []
    }
})

watch(() => form.value.id_asiento, (nuevoId) => {
    const asiento = asientos.value.find(a => a.id_asiento === nuevoId)
    if (asiento) {
        form.value.precio = preciosPorClase[asiento.clase] || ''
    }
})

const pasajeroNombre = computed(() => {
    const p = pasajeros.value.find(p => p.id_pasajero === form.value.id_pasajero)
    return p ? `${p.nombre} ${p.primer_apellido} — ${p.num_pasaporte}` : '—'
})

const vueloNombre = computed(() => {
    const v = vuelos.value.find(v => v.id_vuelo === form.value.id_vuelo)
    return v ? `${v.codigo_vuelo} — ${formatFecha(v.fecha_salida)}` : '—'
})

const formatFecha = d => d
    ? new Date(d).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })
    : '—'

let tablaInstance = null

const inicializarTabla = () => {
    if (tablaInstance) { tablaInstance.destroy(); tablaInstance = null }
    nextTick(() => {
        tablaInstance = window.$('#tablaReservas').DataTable({
            data: reservas.value,
            columns: [
                { data: 'id_reserva' },
                {
                    data: 'fecha_reserva',
                    render: (d, type) => {
                        if (type === 'display') return formatFecha(d)
                        return d ? new Date(d).toLocaleDateString('es-MX') : ''
                    }
                },
                {
                    data: 'estado',
                    render: d => {
                        const map = {
                            confirmada: { cls: 'badge-confirmada', label: 'Confirmada' },
                            cancelada: { cls: 'badge-cancelada', label: 'Cancelada' },
                            en_espera: { cls: 'badge-espera', label: 'En espera' }
                        }
                        const b = map[d] || { cls: '', label: d }
                        return `<span class="estado-badge ${b.cls}">${b.label}</span>`
                    }
                },
                {
                    data: 'Pasajero',
                    render: p => p ? `${p.nombre} ${p.primer_apellido}` : '—'
                },
                {
                    data: 'Vuelo',
                    render: v => v ? v.codigo_vuelo : '—'
                },
                {
                    data: 'id_grupo',
                    render: g => g ? `<span style="color:#c9a84c;font-weight:700;">Grupo #${g}</span>` : '<span style="color:#b89a8a;">Individual</span>'
                },
                {
                    data: 'GrupoReserva',
                    orderable: false,
                    render: g => {
                        if (!g) return '<span style="color:#b89a8a;font-size:0.75rem;">Sin pago</span>'
                        if (g.Pago) {
                            const metodos = { tarjeta: 'Tarjeta', transferencia: 'Transferencia bancaria', puntos: 'Millas' }
                            const metodo = metodos[g.Pago.metodo] || g.Pago.metodo
                            return `<span style="background:rgba(46,155,90,0.15);color:#7fd4a0;border:1px solid rgba(46,155,90,0.3);padding:0.2rem 0.6rem;border-radius:20px;font-size:0.75rem;font-weight:700;">${metodo}</span>`
                        }
                        return '<span style="background:rgba(201,168,76,0.15);color:#c9a84c;border:1px solid rgba(201,168,76,0.3);padding:0.2rem 0.6rem;border-radius:20px;font-size:0.75rem;font-weight:700;">Pendiente</span>'
                    }
                },
                {
                    data: 'id_reserva',
                    orderable: false,
                    render: (id, type, row) => `
            <div class="action-btns">
              ${row.id_grupo ? `<button class="btn-pagar" data-id="${row.id_grupo}" data-reserva="${id}" title="Pagar grupo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </button>` : ''}
              <button class="btn-edit" data-id="${id}" title="Editar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="btn-delete" data-id="${id}" title="Eliminar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>`
                }
            ],
            language: { url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-MX.json' },
            pageLength: 10,
            dom: '<"dt-top"lf>rt<"dt-bottom"ip>',
            drawCallback: () => {
                document.querySelectorAll('.btn-edit').forEach(btn => {
                    btn.onclick = () => abrirModalEditar(Number(btn.dataset.id))
                })
                document.querySelectorAll('.btn-delete').forEach(btn => {
                    btn.onclick = () => confirmarEliminar(Number(btn.dataset.id))
                })
                document.querySelectorAll('.btn-pagar').forEach(btn => {
                    btn.onclick = () => abrirModalPago(Number(btn.dataset.id))
                })
            }
        })
    })
}

const cargarReservas = async () => {
    try {
        const res = await getReservas()
        reservas.value = res.data
        inicializarTabla()
    } catch { console.error('Error al cargar reservas') }
}

const cargarSelectores = async () => {
    try {
        const [resPasajeros, resVuelos, resGrupos] = await Promise.all([
            getPasajeros(),
            getVuelos(),
            getGrupos()
        ])
        pasajeros.value = resPasajeros.data
        vuelos.value = resVuelos.data.filter(v => v.estado === 'programado')
        grupos.value = resGrupos.data
    } catch { console.error('Error al cargar selectores') }
}

const abrirModalCrear = () => {
    modoEdicion.value = false
    reservaEditandoId.value = null
    form.value = formVacio()
    error.value = ''
    mostrarModal.value = true
}

const abrirModalEditar = id => {
    const reserva = reservas.value.find(r => r.id_reserva === id)
    if (!reserva) return
    modoEdicion.value = true
    reservaEditandoId.value = id
    error.value = ''
    form.value = {
        id_pasajero: reserva.id_pasajero,
        id_vuelo: reserva.id_vuelo,
        id_asiento: '',
        precio: '',
        estado: reserva.estado,
        id_grupo: reserva.id_grupo || ''
    }

    mostrarModal.value = true
}

const cerrarModal = () => { mostrarModal.value = false }

const abrirModalPago = async (idGrupo) => {
    try {
        const res = await api.get(`/pagos/grupo/${idGrupo}`)
        grupoPagando.value = idGrupo
        montoPago.value = res.data.Pago ? res.data.Pago.monto_total : 0
        metodoPago.value = 'tarjeta'
        mostrarModalPago.value = true
    } catch {
        grupoPagando.value = idGrupo
        montoPago.value = 0
        metodoPago.value = 'tarjeta'
        mostrarModalPago.value = true
    }
}

const cerrarModalPago = () => { mostrarModalPago.value = false }

const registrarPago = async () => {
    loadingPago.value = true
    try {
        await registrarPagoAPI({
            id_grupo: grupoPagando.value,
            metodo: metodoPago.value,
            moneda: 'MXN'
        })
        window.Swal.fire({
            icon: 'success',
            title: '¡Pago registrado!',
            text: 'El pago del grupo fue registrado y las reservas confirmadas.',
            background: '#1a0c10', color: '#f0e8e0', confirmButtonColor: '#c9a84c'
        })
        cerrarModalPago()
        await cargarReservas()
    } catch (err) {
        window.Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.response?.data?.mensaje || 'No se pudo registrar el pago.',
            background: '#1a0c10', color: '#f0e8e0', confirmButtonColor: '#c9a84c'
        })
    } finally {
        loadingPago.value = false
    }
}

const guardarReserva = async () => {
    if (!form.value.id_pasajero) { error.value = 'Selecciona un pasajero.'; return }
    if (!form.value.id_vuelo) { error.value = 'Selecciona un vuelo.'; return }
    if (!modoEdicion.value && !form.value.id_asiento) { error.value = 'Selecciona un asiento para continuar.'; return }

    error.value = ''
    loading.value = true

    try {
        if (modoEdicion.value) {
            await actualizarReserva(reservaEditandoId.value, { estado: form.value.estado })
            
            window.Swal.fire({
                icon: 'success', 
                title: '¡Actualizado!', 
                text: 'Reserva actualizada correctamente.',
                background: '#1a0c10', 
                color: '#f0e8e0', 
                confirmButtonColor: '#c9a84c'
            })
        } else {
            const resCreada = await crearReserva({
                id_vuelo: form.value.id_vuelo,
                id_pasajero: form.value.id_pasajero,
                id_asiento: form.value.id_asiento,
                precio: form.value.precio,
                id_grupo: form.value.id_grupo || null,
                tipo_reserva: form.value.tipo_reserva
            })

            cerrarModal()
            await cargarReservas()

            // Abrir modal de pago automáticamente
            const idGrupo = resCreada.data?.id_grupo
            if (idGrupo) {
                await abrirModalPago(idGrupo)
            }
            return
        }

        cerrarModal()
        await cargarReservas()
    } catch (err) {
        error.value = err.response?.data?.mensaje || 'Error al guardar la reserva.'
    } finally {
        loading.value = false
    }
}
const confirmarEliminar = async id => {
    const result = await window.Swal.fire({
        title: '¿Eliminar reserva?',
        text: 'Se eliminarán también los asientos asignados.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: '#1a0c10', color: '#f0e8e0',
        confirmButtonColor: '#9b1c2e', cancelButtonColor: '#4a3020'
    })
    if (!result.isConfirmed) return
    try {
        await eliminarReserva(id)
        window.Swal.fire({
            icon: 'success', title: 'Eliminada', text: 'La reserva fue eliminada.',
            background: '#1a0c10', color: '#f0e8e0', confirmButtonColor: '#c9a84c'
        })
        await cargarReservas()
    } catch (err) {
        const mensaje = err.response?.data?.mensaje || 'No se pudo eliminar la reserva.'
        window.Swal.fire({
            icon: 'error', title: 'Error', text: mensaje,
            background: '#1a0c10', color: '#f0e8e0', confirmButtonColor: '#c9a84c'
        })
    }
}

const handleLogout = async () => {
    await logoutUsuario()
    localStorage.removeItem('usuario')
    router.push('/')
}

onMounted(async () => {
    const data = localStorage.getItem('usuario')
    if (!data) { router.push('/login'); return }
    usuario.value = JSON.parse(data)
    window.addEventListener('session-timer', onSessionTimer)
    await cargarSelectores()
    await cargarReservas()
})

onUnmounted(() => {
    window.removeEventListener('session-timer', onSessionTimer)
})
</script>

<style scoped>
@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-up {
    animation: fadeUp 0.5s ease forwards;
}

.dashboard {
    display: flex;
    min-height: 100vh;
    background-color: #0f0508;
    color: #f0e8e0;
    font-family: 'Segoe UI', system-ui, sans-serif;
}

.sidebar {
    width: 280px;
    background: #1a0c10;
    border-right: 1px solid rgba(201, 168, 76, 0.15);
    display: flex;
    flex-direction: column;
    transition: width 0.3s ease;
    position: sticky;
    top: 0;
    height: 100vh;
}

.sidebar.collapsed {
    width: 75px;
}

.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.75rem 1.25rem;
    border-bottom: 1px solid rgba(201, 168, 76, 0.1);
}

.sidebar-brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    text-decoration: none;
    color: #c9a84c;
    font-size: 1.4rem;
    font-weight: 800;
}

.collapse-btn {
    background: transparent;
    border: none;
    color: #b89a8a;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    transition: color 0.2s;
}

.collapse-btn:hover {
    color: #c9a84c;
}

.sidebar-nav {
    flex: 1;
    padding: 1.25rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-radius: 8px;
    text-decoration: none;
    color: #b89a8a;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s;
}

.nav-item:hover {
    background: rgba(201, 168, 76, 0.08);
    color: #c9a84c;
}

.nav-item.active {
    background: rgba(201, 168, 76, 0.12);
    color: #c9a84c;
    font-weight: 700;
}

.nav-item svg {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
}

.sidebar-footer {
    padding: 1.25rem;
    border-top: 1px solid rgba(201, 168, 76, 0.1);
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    color: #c9a84c;
}

.user-name {
    display: block;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
}

.user-role {
    display: block;
    font-size: 0.8rem;
    color: #b89a8a;
}

.btn-logout {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(107, 15, 26, 0.3);
    border: 1px solid rgba(107, 15, 26, 0.5);
    color: #f0a0a0;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.2s;
}

.btn-logout:hover {
    background: rgba(107, 15, 26, 0.6);
}

.main-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
}

.topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(201, 168, 76, 0.1);
}

.page-title {
    font-size: 1.6rem;
    font-weight: 800;
    color: #fff;
    margin: 0;
}

.welcome-text {
    color: #b89a8a;
    font-size: 0.9rem;
}

.welcome-text strong {
    color: #c9a84c;
}

.session-timer {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(201, 168, 76, 0.08);
    border: 1px solid rgba(201, 168, 76, 0.2);
    border-radius: 20px;
    padding: 0.3rem 0.8rem;
    font-size: 0.85rem;
    font-weight: 700;
    color: #c9a84c;
    font-family: monospace;
    transition: all 0.3s;
}

.timer-warning {
    background: rgba(155, 28, 46, 0.15);
    border-color: rgba(155, 28, 46, 0.4);
    color: #f08080;
}

.reservas-page {
    color: #f0e8e0;
}

.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.75rem;
}

.page-header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.page-icon {
    width: 48px;
    height: 48px;
    background: rgba(201, 168, 76, 0.12);
    border: 1px solid rgba(201, 168, 76, 0.3);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c9a84c;
}

.section-title {
    font-size: 1.2rem;
    font-weight: 800;
    margin: 0;
    color: #fff;
}

.page-subtitle {
    font-size: 0.85rem;
    color: #b89a8a;
    margin: 0;
}

.btn-primary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #c9a84c;
    color: #4a0a12;
    font-weight: 700;
    font-size: 0.9rem;
    padding: 0.7rem 1.25rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
    background: #f0c96b;
    transform: translateY(-1px);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-secondary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    color: #b89a8a;
    font-weight: 600;
    font-size: 0.9rem;
    padding: 0.7rem 1.25rem;
    border-radius: 8px;
    border: 1px solid rgba(201, 168, 76, 0.2);
    cursor: pointer;
    transition: all 0.2s;
}

.btn-secondary:hover {
    border-color: #c9a84c;
    color: #c9a84c;
}

.table-card {
    background: #1a0c10;
    border: 1px solid rgba(201, 168, 76, 0.15);
    border-radius: 14px;
    padding: 1.5rem;
}

.table-responsive {
    overflow-x: auto;
}

:deep(.quetzal-table) {
    color: #f0e8e0 !important;
    border-collapse: collapse;
    width: 100%;
}

:deep(.quetzal-table thead th) {
    background: rgba(201, 168, 76, 0.08) !important;
    color: #c9a84c !important;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(201, 168, 76, 0.2) !important;
    padding: 0.9rem 1rem !important;
}

:deep(.quetzal-table tbody tr) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
}

:deep(.quetzal-table tbody tr:hover td) {
    background: rgba(201, 168, 76, 0.05) !important;
}

:deep(.quetzal-table tbody td) {
    padding: 0.85rem 1rem !important;
    font-size: 0.9rem;
    color: #f0e8e0 !important;
    border: none !important;
}

:deep(.dataTables_wrapper .dataTables_length label),
:deep(.dataTables_wrapper .dataTables_filter label),
:deep(.dataTables_wrapper .dataTables_info),
:deep(.dataTables_wrapper .dataTables_paginate) {
    color: #b89a8a !important;
    font-size: 0.85rem;
}

:deep(.dataTables_wrapper .dataTables_filter input),
:deep(.dataTables_wrapper .dataTables_length select) {
    background: rgba(255, 255, 255, 0.04) !important;
    border: 1px solid rgba(201, 168, 76, 0.2) !important;
    color: #f0e8e0 !important;
    border-radius: 6px;
    padding: 0.3rem 0.6rem;
    outline: none;
}

:deep(.dataTables_wrapper .dataTables_filter input:focus) {
    border-color: #c9a84c !important;
}

:deep(.dt-top) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
}

:deep(.dt-bottom) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
}

:deep(.paginate_button) {
    padding: 0.35rem 0.7rem !important;
    border-radius: 6px !important;
    cursor: pointer;
    color: #b89a8a !important;
    border: none !important;
    background: transparent !important;
}

:deep(.paginate_button.current),
:deep(.paginate_button:hover) {
    background: rgba(201, 168, 76, 0.15) !important;
    color: #c9a84c !important;
}

:deep(.paginate_button.disabled) {
    opacity: 0.3 !important;
    cursor: default !important;
}

:deep(.estado-badge) {
    display: inline-block;
    padding: 0.25rem 0.7rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.5px;
}

:deep(.badge-confirmada) {
    background: rgba(46, 155, 90, 0.15);
    color: #7fd4a0;
    border: 1px solid rgba(46, 155, 90, 0.3);
}

:deep(.badge-cancelada) {
    background: rgba(155, 28, 46, 0.2);
    color: #f08080;
    border: 1px solid rgba(155, 28, 46, 0.4);
}

:deep(.badge-espera) {
    background: rgba(201, 168, 76, 0.15);
    color: #c9a84c;
    border: 1px solid rgba(201, 168, 76, 0.3);
}

:deep(.action-btns) {
    display: flex;
    gap: 0.5rem;
}

:deep(.btn-edit),
:deep(.btn-delete) {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
}

:deep(.btn-edit) {
    background: rgba(201, 168, 76, 0.12);
    color: #c9a84c;
}

:deep(.btn-edit:hover) {
    background: rgba(201, 168, 76, 0.25);
}

:deep(.btn-delete) {
    background: rgba(155, 28, 46, 0.12);
    color: #f08080;
}

:deep(.btn-delete:hover) {
    background: rgba(155, 28, 46, 0.3);
}

:deep(.btn-pagar) {
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    background: rgba(46, 155, 90, 0.12);
    color: #7fd4a0;
    vertical-align: middle;
}

:deep(.btn-pagar:hover) {
    background: rgba(46, 155, 90, 0.3);
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 5, 8, 0.85);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 1rem;
}

.modal-box {
    background: #1a0c10;
    border: 1px solid rgba(201, 168, 76, 0.2);
    border-radius: 16px;
    width: 100%;
    max-width: 750px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem 1.5rem 0;
}

.modal-icon {
    width: 40px;
    height: 40px;
    background: rgba(201, 168, 76, 0.12);
    border: 1px solid rgba(201, 168, 76, 0.25);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c9a84c;
    flex-shrink: 0;
}

.modal-title {
    font-size: 1.2rem;
    font-weight: 800;
    margin: 0;
    flex: 1;
}

.modal-close {
    background: transparent;
    border: none;
    cursor: pointer;
    color: #b89a8a;
    display: flex;
    align-items: center;
    transition: color 0.2s;
    padding: 0;
}

.modal-close:hover {
    color: #f08080;
}

.modal-body {
    padding: 1.5rem;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 0 1.5rem 1.5rem;
}

.form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.form-row .form-group {
    flex: 1;
    margin-bottom: 0;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #c9a84c;
    margin-bottom: 0.45rem;
}

.input-wrapper {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(201, 168, 76, 0.2);
    border-radius: 8px;
    padding: 0 0.9rem;
    gap: 0.6rem;
    transition: border-color 0.2s;
}

.input-wrapper:focus-within {
    border-color: #c9a84c;
}

.input-wrapper svg {
    color: #c9a84c;
    flex-shrink: 0;
}

.input-wrapper input,
.input-wrapper select {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #f0e8e0;
    font-size: 0.9rem;
    padding: 0.75rem 0;
    font-family: inherit;
}

.input-wrapper select option {
    background: #1a0c10;
}

.input-wrapper input::placeholder {
    color: #6b5a5a;
}

.input-wrapper select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.input-readonly {
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(201, 168, 76, 0.1);
    cursor: default;
}

.readonly-text {
    font-size: 0.9rem;
    color: #b89a8a;
    padding: 0.75rem 0;
}

.label-readonly {
    font-size: 0.65rem;
    color: #6b5a5a;
    font-weight: 400;
    letter-spacing: 0;
    text-transform: none;
    margin-left: 0.3rem;
}

.error-msg {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(107, 15, 26, 0.3);
    border: 1px solid rgba(107, 15, 26, 0.5);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    color: #f0a0a0;
    font-size: 0.88rem;
    margin-top: 0.5rem;
}

@media (max-width: 540px) {
    .form-row {
        flex-direction: column;
    }
}
</style>