const { Vuelo, Ruta, Avion } = require('../models/index');

// Obtener todos los vuelos
const obtenerVuelos = async (req, res) => {
  try {
    const vuelos = await Vuelo.findAll({
      include: [
        { model: Ruta },
        { model: Avion }
      ]
    });
    res.json(vuelos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener vuelos', error: error.message });
  }
};

module.exports = { obtenerVuelos };