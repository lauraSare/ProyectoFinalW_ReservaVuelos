const { sequelize } = require('../config/database');

const Avion = require('./Avion');
const Ruta = require('./Ruta');
const Vuelo = require('./Vuelo');
const Asiento = require('./Asiento');
const Pasajero = require('./Pasajero');
const Reserva = require('./Reserva');
const ReservaAsiento = require('./ReservaAsiento');

// Avion -> Asientos
Avion.hasMany(Asiento, { foreignKey: 'id_avion' });
Asiento.belongsTo(Avion, { foreignKey: 'id_avion' });

// Avion -> Vuelos
Avion.hasMany(Vuelo, { foreignKey: 'id_avion' });
Vuelo.belongsTo(Avion, { foreignKey: 'id_avion' });

// Ruta -> Vuelos
Ruta.hasMany(Vuelo, { foreignKey: 'id_ruta' });
Vuelo.belongsTo(Ruta, { foreignKey: 'id_ruta' });

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

module.exports = {
    sequelize,
    Avion,
    Ruta,
    Vuelo,
    Asiento,
    Pasajero,
    Reserva,
    ReservaAsiento
};