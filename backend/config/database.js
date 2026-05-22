const { Sequelize } = require("sequelize");
require("dotenv").config();

/**
 * PATRÓN DE DISEÑO: SINGLETON (Creacional)
 * Garantiza que solo exista UNA instancia de la conexión
 * a la base de datos durante toda la ejecución del servidor.
 * Cualquier módulo que importe esta clase obtiene siempre
 * la misma instancia, evitando conexiones duplicadas.
 */
/**
 * PRINCIPIO SOLID - SINGLE RESPONSIBILITY (Responsabilidad Única):
 * La clase Database tiene una única responsabilidad: gestionar
 * la conexión a la base de datos. No maneja modelos, consultas
 * ni lógica de negocio — eso queda en los controllers y services.
 */
class Database {
  constructor() {
    if (Database.instancia) {
      return Database.instancia;
    }

    this.sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: false,
      },
    );

    Database.instancia = this;
  }

  async conectar() {
    try {
      await this.sequelize.authenticate();
      console.log("Conexión a la base de datos exitosa");
    } catch (error) {
      console.error("Error al conectar a la base de datos:", error);
      process.exit(1);
    }
  }
}

const db = new Database();

module.exports = { sequelize: db.sequelize, conectarDB: () => db.conectar() };
