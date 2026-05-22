const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VueloTripulacion = sequelize.define('VueloTripulacion', {
    id_vuelo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_tripulacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    rol_en_vuelo: {
        type: DataTypes.ENUM('piloto', 'copiloto', 'auxiliar'),
        allowNull: false
    }
}, {
    tableName: 'vuelo_tripulacion',
    timestamps: false
});

module.exports = VueloTripulacion;