const express = require("express");
const router = express.Router();
const {
  Pago,
  GrupoReserva,
  Reserva,
  ReservaAsiento,
  sequelize,
} = require("../models/index");

// Registrar pago para un grupo
router.post("/", async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_grupo, metodo, moneda } = req.body;

    // Buscar todas las reservas del grupo con sus asientos
    const reservas = await Reserva.findAll({
      where: { id_grupo },
      include: [{ model: ReservaAsiento }],
      transaction: t,
    });

    if (!reservas.length) {
      await t.rollback();
      return res
        .status(404)
        .json({ mensaje: "No se encontraron reservas en este grupo" });
    }

    // Calcular monto total
    const monto_total = reservas.reduce((total, r) => {
      const precioReserva =
        r.ReservaAsientos?.reduce((s, a) => s + parseFloat(a.precio || 0), 0) ||
        0;
      return total + precioReserva;
    }, 0);

    // Crear el pago
    const pago = await Pago.create(
      {
        metodo,
        monto_total,
        moneda: moneda || "MXN",
        fecha_transaccion: new Date(),
        estado: "completado",
      },
      { transaction: t },
    );

    // Vincular pago al grupo
    await GrupoReserva.update(
      { id_pago: pago.id_pago },
      { where: { id_grupo }, transaction: t },
    );

    // Confirmar todas las reservas del grupo
    await Reserva.update(
      { estado: "confirmada" },
      { where: { id_grupo }, transaction: t },
    );

    await t.commit();

    res.status(201).json({
      mensaje: "Pago registrado exitosamente",
      pago,
      monto_total,
      reservas_confirmadas: reservas.length,
    });
  } catch (error) {
    await t.rollback();
    console.error("ERROR PAGO:", error);
    res
      .status(500)
      .json({ mensaje: "Error al registrar pago", error: error.message });
  }
});

// Obtener pago de un grupo
router.get("/grupo/:id_grupo", async (req, res) => {
  try {
    const grupo = await GrupoReserva.findByPk(req.params.id_grupo, {
      include: [{ model: require("../models/index").Pago, as: "Pago" }],
    });
    if (!grupo) return res.status(404).json({ mensaje: "Grupo no encontrado" });
    res.json(grupo);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener pago", error: error.message });
  }
});

module.exports = router;
