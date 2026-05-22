const express = require("express");
const router = express.Router();
const Avion = require("../models/Avion");

router.get("/", async (req, res) => {
  try {
    const aviones = await Avion.findAll();
    res.json(aviones);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener aviones", error: error.message });
  }
});

module.exports = router;
