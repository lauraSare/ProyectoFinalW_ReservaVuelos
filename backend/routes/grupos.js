const express = require("express");
const router = express.Router();
const { GrupoReserva } = require("../models/index");

// Obtener todos los grupos de reserva
router.get("/", async (req, res) => {
  try {
    const grupos = await GrupoReserva.findAll({
      include: [
        {
          model: require("../models/index").Pasajero,
          as: "Responsable",
          attributes: ["id_pasajero", "nombre", "primer_apellido"],
        },
      ],
    });
    res.json(grupos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener grupos", error: error.message });
  }
});

// Crear nuevo grupo de reserva
router.post("/", async (req, res) => {
  try {
    const { id_pasajero_responsable, descripcion } = req.body;

    const nuevoGrupo = await GrupoReserva.create({
      descripcion:
        descripcion || `Grupo ${new Date().toISOString().slice(0, 19)}`,
      id_pasajero_responsable,
    });

    res.status(201).json({
      mensaje: "Grupo de reserva creado exitosamente",
      grupo: nuevoGrupo,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear grupo", error: error.message });
  }
});

module.exports = router;
