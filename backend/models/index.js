const { sequelize } = require('../config/database');

const Avion = require('./Avion');
const Ruta = require('./Ruta');
const Vuelo = require('./Vuelo');
const Asiento = require('./Asiento');
const Pasajero = require('./Pasajero');
const Reserva = require('./Reserva');
const ReservaAsiento = require('./ReservaAsiento');
const Aeropuerto = require('./Aeropuerto');
const Tripulacion = require('./Tripulacion');
const VueloTripulacion = require('./VueloTripulacion');


// Avion -> Asientos
Avion.hasMany(Asiento, { foreignKey: 'id_avion' });
Asiento.belongsTo(Avion, { foreignKey: 'id_avion' });

// Avion -> Vuelos
Avion.hasMany(Vuelo, { foreignKey: 'id_avion', as: 'VuelosDelAvion' });
Vuelo.belongsTo(Avion, { foreignKey: 'id_avion', as: 'Avion' });

// Aeropuerto -> Rutas
Aeropuerto.hasMany(Ruta, { foreignKey: 'id_origen', as: 'Origen' });
Aeropuerto.hasMany(Ruta, { foreignKey: 'id_destino', as: 'Destino' });
Ruta.belongsTo(Aeropuerto, { foreignKey: 'id_origen', as: 'Origen' });
Ruta.belongsTo(Aeropuerto, { foreignKey: 'id_destino', as: 'Destino' });

// Ruta -> Vuelos
Ruta.hasMany(Vuelo, { foreignKey: 'id_ruta', as: 'Ruta' });
Vuelo.belongsTo(Ruta, { foreignKey: 'id_ruta', as: 'Ruta' });

// Pasajero -> Reservas
Pasajero.hasMany(Reserva, { foreignKey: 'id_pasajero' });
Reserva.belongsTo(Pasajero, { foreignKey: 'id_pasajero' });

// Vuelo -> Reservas
Vuelo.hasMany(Reserva, { foreignKey: 'id_vuelo' });
Reserva.belongsTo(Vuelo, { foreignKey: 'id_vuelo' });

// Reserva -> ReservaAsiento
Reserva.hasMany(ReservaAsiento, { foreignKey: 'id_reserva' });
ReservaAsiento.belongsTo(Reserva, { foreignKey: 'id_reserva' });

// Asiento -> ReservaAsiento
Asiento.hasMany(ReservaAsiento, { foreignKey: 'id_asiento' });
ReservaAsiento.belongsTo(Asiento, { foreignKey: 'id_asiento' });

// Tripulacion -> VueloTripulacion
Tripulacion.belongsToMany(Vuelo, { through: VueloTripulacion, foreignKey: 'id_tripulacion', as: 'Vuelos' });
Vuelo.belongsToMany(Tripulacion, { through: VueloTripulacion, foreignKey: 'id_vuelo', as: 'Tripulacion' });

// ====================== NUEVAS ASOCIACIONES ======================
const GrupoReserva = require('./GrupoReserva');
const Pago = require('./Pago');

// GrupoReserva -> Pasajero (responsable)
GrupoReserva.belongsTo(Pasajero, { 
    foreignKey: 'id_pasajero_responsable', 
    as: 'Responsable' 
});

// GrupoReserva -> Pago
GrupoReserva.belongsTo(Pago, { 
    foreignKey: 'id_pago', 
    as: 'Pago' 
});
Pago.hasOne(GrupoReserva, { 
    foreignKey: 'id_pago' 
});

// Reserva -> GrupoReserva (clave para reservas grupales)
Reserva.belongsTo(GrupoReserva, { 
    foreignKey: 'id_grupo', 
    as: 'GrupoReserva' 
});
GrupoReserva.hasMany(Reserva, { 
    foreignKey: 'id_grupo', 
    as: 'Reservas' 
});

module.exports = {
    sequelize,
    Avion,
    Ruta,
    Vuelo,
    Asiento,
    Pasajero,
    Reserva,
    ReservaAsiento,
    Aeropuerto,
    Tripulacion,
    VueloTripulacion,
    GrupoReserva,     
    Pago              
};