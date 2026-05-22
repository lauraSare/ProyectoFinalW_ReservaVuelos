const express = require('express');
const router = express.Router();
const { Asiento, Vuelo, ReservaAsiento } = require('../models/index');
const { Op } = require('sequelize');

// Obtener todos los asientos
router.get('/', async (req, res) => {
  try {
    const asientos = await Asiento.findAll();
    res.json(asientos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener asientos', error: error.message });
  }
});

// Obtener asientos disponibles por vuelo
router.get('/disponibles/:id_vuelo', async (req, res) => {
  try {
    const vuelo = await Vuelo.findByPk(req.params.id_vuelo);
    if (!vuelo) {
      return res.status(404).json({ mensaje: 'Vuelo no encontrado' });
    }

    // Obtener asientos ya reservados en este vuelo
    const asientosOcupados = await ReservaAsiento.findAll({
      include: [{
        model: Asiento,
        where: { id_avion: vuelo.id_avion }
      }],
      attributes: ['id_asiento']
    });

    const idsOcupados = asientosOcupados.map(r => r.id_asiento);

    // Obtener asientos del avión que no estén ocupados
    const asientosDisponibles = await Asiento.findAll({
      where: {
        id_avion: vuelo.id_avion,
        id_asiento: { [Op.notIn]: idsOcupados.length > 0 ? idsOcupados : [0] }
      },
      order: [['clase', 'ASC'], ['numero_asiento', 'ASC']]
    });

    res.json(asientosDisponibles);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener asientos disponibles', error: error.message });
  }
});

module.exports = router;