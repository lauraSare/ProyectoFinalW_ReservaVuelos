const express = require("express");
const router = express.Router();
const {
  obtenerPasajeros,
  obtenerPasajeroPorId,
  crearPasajero,
  actualizarPasajero,
  eliminarPasajero,
} = require("../controllers/pasajeroController");

// Obtener todos los pasajeros
router.get("/", obtenerPasajeros);

// Crear un pasajero
router.post("/", crearPasajero);

// Obtener un pasajero por ID
router.get("/:id", obtenerPasajeroPorId);

// Actualizar un pasajero
router.put("/:id", actualizarPasajero);

// Eliminar un pasajero
router.delete("/:id", eliminarPasajero);

module.exports = router;
