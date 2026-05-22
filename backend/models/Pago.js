const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Pago = sequelize.define(
  "Pago",
  {
    id_pago: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    metodo: {
      type: DataTypes.ENUM("tarjeta", "transferencia", "puntos"),
      allowNull: false,
    },
    monto_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    moneda: {
      type: DataTypes.STRING(10),
      defaultValue: "MXN",
    },
    fecha_transaccion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "completado", "fallido"),
      defaultValue: "pendiente",
    },
  },
  {
    tableName: "pagos",
    timestamps: false,
  },
);

module.exports = Pago;
