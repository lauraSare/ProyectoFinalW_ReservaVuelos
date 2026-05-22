const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const GrupoReserva = sequelize.define(
  "GrupoReserva",
  {
    id_grupo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    id_pasajero_responsable: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_pago: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "grupo_reserva",
    timestamps: false,
  },
);

module.exports = GrupoReserva;
