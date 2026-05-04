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

// Obtener un vuelo por ID
const obtenerVueloPorId = async (req, res) => {
  try {
    const vuelo = await Vuelo.findByPk(req.params.id, {
      include: [
        { model: Ruta },
        { model: Avion }
      ]
    });
    if (!vuelo) {
      return res.status(404).json({ mensaje: 'Vuelo no encontrado' });
    }
    res.json(vuelo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener vuelo', error: error.message });
  }
};

// Crear un vuelo
const crearVuelo = async (req, res) => {
  try {
    const {
      codigo_vuelo,
      fecha_salida,
      fecha_llegada,
      estado,
      id_ruta,
      id_avion
    } = req.body;

    const existe = await Vuelo.findOne({ where: { codigo_vuelo } });
    if (existe) {
      return res.status(400).json({ mensaje: 'El código de vuelo ya existe' });
    }

    const nuevoVuelo = await Vuelo.create({
      codigo_vuelo,
      fecha_salida,
      fecha_llegada,
      estado,
      id_ruta,
      id_avion
    });

    res.status(201).json({ mensaje: 'Vuelo creado exitosamente', vuelo: nuevoVuelo });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear vuelo', error: error.message });
  }
};

// Actualizar un vuelo
const actualizarVuelo = async (req, res) => {
  try {
    const vuelo = await Vuelo.findByPk(req.params.id);
    if (!vuelo) {
      return res.status(404).json({ mensaje: 'Vuelo no encontrado' });
    }

    await vuelo.update(req.body);
    res.json({ mensaje: 'Vuelo actualizado exitosamente', vuelo });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar vuelo', error: error.message });
  }
};

// Eliminar un vuelo
const eliminarVuelo = async (req, res) => {
  try {
    const vuelo = await Vuelo.findByPk(req.params.id);
    if (!vuelo) {
      return res.status(404).json({ mensaje: 'Vuelo no encontrado' });
    }

    await vuelo.destroy();
    res.json({ mensaje: 'Vuelo eliminado exitosamente' });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar vuelo', error: error.message });
  }
};

module.exports = { obtenerVuelos, obtenerVueloPorId, crearVuelo, actualizarVuelo, eliminarVuelo };