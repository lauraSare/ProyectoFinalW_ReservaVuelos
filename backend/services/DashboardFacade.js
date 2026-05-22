const { sequelize } = require("../models/index");

/**
 * PATRÓN DE DISEÑO: FACADE (Estructural)
 * Proporciona una interfaz simplificada para obtener
 * las estadísticas del dashboard, ocultando la complejidad
 * de múltiples consultas a diferentes tablas de la BD.
 * El controller solo llama a un método y recibe todo listo.
 */
class DashboardFacade {
  async obtenerVuelosDisponibles() {
    const [result] = await sequelize.query(
      "SELECT COUNT(*) as total FROM vuelos WHERE estado = 'programado'",
    );
    return result[0].total;
  }

  async obtenerTotalPasajeros() {
    const [result] = await sequelize.query(
      "SELECT COUNT(*) as total FROM pasajeros",
    );
    return result[0].total;
  }

  async obtenerReservasActivas() {
    const [result] = await sequelize.query(
      "SELECT COUNT(*) as total FROM reservas WHERE estado = 'confirmada'",
    );
    return result[0].total;
  }

  async obtenerTotalAsientos() {
    const [result] = await sequelize.query(
      "SELECT COUNT(*) as total FROM asientos",
    );
    return result[0].total;
  }

  async obtenerReservasRecientes() {
    const [result] = await sequelize.query(`
      SELECT r.id_reserva, r.fecha_reserva, r.estado,
             p.nombre, p.primer_apellido,
             v.codigo_vuelo
      FROM reservas r
      JOIN pasajeros p ON r.id_pasajero = p.id_pasajero
      JOIN vuelos v ON r.id_vuelo = v.id_vuelo
      ORDER BY r.fecha_reserva DESC
      LIMIT 5
    `);
    return result;
  }

  async obtenerIngresosTotales() {
    const [result] = await sequelize.query(
      "SELECT COALESCE(SUM(monto_total), 0) as total FROM pagos WHERE estado = 'completado'"
    );
    return parseFloat(result[0].total);
  }

  async obtenerEstadisticasCompletas() {
    const [vuelos, pasajeros, reservas, asientos, recientes, ingresos] = await Promise.all([
      this.obtenerVuelosDisponibles(),
      this.obtenerTotalPasajeros(),
      this.obtenerReservasActivas(),
      this.obtenerTotalAsientos(),
      this.obtenerReservasRecientes(),
      this.obtenerIngresosTotales(),
    ]);
    return { vuelos, pasajeros, reservas, asientos, recientes, ingresos };
  }
}

module.exports = new DashboardFacade();
