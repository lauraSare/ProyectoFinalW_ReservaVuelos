const express = require("express");
const router = express.Router();
const {
  obtenerTripulacion,
  obtenerTripulantePorId,
  crearTripulante,
  actualizarTripulante,
  eliminarTripulante,
  asignarVuelo,
  quitarVuelo,
} = require("../controllers/tripulacionController");

router.get("/", obtenerTripulacion);
router.get("/:id", obtenerTripulantePorId);
router.post("/", crearTripulante);
router.put("/:id", actualizarTripulante);
router.delete("/:id", eliminarTripulante);
router.post("/:id/vuelos", asignarVuelo);
router.delete("/:id/vuelos/:id_vuelo", quitarVuelo);

module.exports = router;
