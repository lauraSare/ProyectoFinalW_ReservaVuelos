const express = require("express");
const router = express.Router();
const Ruta = require("../models/Ruta");

router.get("/", async (req, res) => {
  try {
    const rutas = await Ruta.findAll();
    res.json(rutas);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener rutas", error: error.message });
  }
});

module.exports = router;
