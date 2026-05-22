const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Tripulacion = sequelize.define(
  "Tripulacion",
  {
    id_tripulacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    primer_apellido: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    segundo_apellido: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    rol: {
      type: DataTypes.ENUM("piloto", "copiloto", "auxiliar"),
      allowNull: false,
    },
    nacionalidad: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  },
  {
    tableName: "tripulacion",
    timestamps: false,
  },
);

module.exports = Tripulacion;
