const { Vuelo, Ruta, Avion, Aeropuerto } = require('../models/index');
const { validarVuelo } = require('../utils/validadores');

// Obtener todos los vuelos
const obtenerVuelos = async (req, res) => {
  try {
    const vuelos = await Vuelo.findAll({
      include: [
        { 
          model: Ruta, as: 'Ruta',
          include: [
            { model: Aeropuerto, as: 'Origen' },
            { model: Aeropuerto, as: 'Destino' }
          ]
        },
        { model: Avion, as: 'Avion' }
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
        { 
          model: Ruta, as: 'Ruta',
          include: [
            { model: Aeropuerto, as: 'Origen' },
            { model: Aeropuerto, as: 'Destino' }
          ]
        },
        { model: Avion, as: 'Avion' }
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

    const errorValidacion = validarVuelo(req.body);
    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
    }

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

    const errorValidacion = validarVuelo({ ...vuelo.toJSON(), ...req.body });
    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
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

    // Solo se pueden eliminar vuelos cancelados
    if (vuelo.estado !== 'cancelado') {
      return res.status(400).json({ 
        mensaje: `Solo se pueden eliminar vuelos con estado "cancelado". Este vuelo está "${vuelo.estado}".` 
      });
    }

    // Verificar si tiene reservas asociadas
    const { Reserva, VueloTripulacion } = require('../models/index');
    const reservas = await Reserva.count({ where: { id_vuelo: req.params.id } });
    if (reservas > 0) {
      return res.status(400).json({ 
        mensaje: `No se puede eliminar el vuelo porque tiene ${reservas} reserva(s) asociada(s).` 
      });
    }

    // Eliminar registros relacionados antes de borrar
    const { sequelize } = require('../models/index');
    await VueloTripulacion.destroy({ where: { id_vuelo: req.params.id } });
    await sequelize.query('DELETE FROM vuelo_asientos WHERE id_vuelo = :id', {
      replacements: { id: req.params.id }
    });

    await vuelo.destroy();
    res.json({ mensaje: 'Vuelo eliminado exitosamente' });

  } catch (error) {
    console.error('ERROR ELIMINAR VUELO:', error);
    res.status(500).json({ mensaje: 'Error al eliminar vuelo', error: error.message });
  }
};

module.exports = { obtenerVuelos, obtenerVueloPorId, crearVuelo, actualizarVuelo, eliminarVuelo };