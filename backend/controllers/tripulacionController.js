const { Tripulacion, VueloTripulacion, Vuelo } = require("../models/index");
const { validarTripulante } = require("../utils/validadores");

// Obtener toda la tripulación
const obtenerTripulacion = async (req, res) => {
  try {
    const tripulacion = await Tripulacion.findAll({
      include: [{ model: Vuelo, as: "Vuelos", attributes: ["id_vuelo", "codigo_vuelo"] }],
    });
    res.json(tripulacion);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener tripulación", error: error.message });
  }
};

// Obtener un miembro por ID
const obtenerTripulantePorId = async (req, res) => {
  try {
    const tripulante = await Tripulacion.findByPk(req.params.id, {
      include: [{ model: Vuelo, as: "Vuelos", attributes: ["id_vuelo", "codigo_vuelo"] }],
    });
    if (!tripulante) return res.status(404).json({ mensaje: "Tripulante no encontrado" });
    res.json(tripulante);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener tripulante", error: error.message });
  }
};

// Crear un tripulante
const crearTripulante = async (req, res) => {
  try {
    const errorValidacion = validarTripulante(req.body);
    if (errorValidacion) return res.status(400).json({ mensaje: errorValidacion });

    const { nombre, primer_apellido, segundo_apellido, rol, nacionalidad } = req.body;
    const nuevoTripulante = await Tripulacion.create({ nombre, primer_apellido, segundo_apellido, rol, nacionalidad });
    res.status(201).json({ mensaje: "Tripulante creado exitosamente", tripulante: nuevoTripulante });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear tripulante", error: error.message });
  }
};

// Actualizar un tripulante
const actualizarTripulante = async (req, res) => {
  try {
    const tripulante = await Tripulacion.findByPk(req.params.id);
    if (!tripulante) return res.status(404).json({ mensaje: "Tripulante no encontrado" });

    const errorValidacion = validarTripulante({ ...tripulante.toJSON(), ...req.body });
    if (errorValidacion) return res.status(400).json({ mensaje: errorValidacion });

    await tripulante.update(req.body);
    res.json({ mensaje: "Tripulante actualizado exitosamente", tripulante });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar tripulante", error: error.message });
  }
};

// Eliminar un tripulante
const eliminarTripulante = async (req, res) => {
  try {
    const tripulante = await Tripulacion.findByPk(req.params.id);
    if (!tripulante) return res.status(404).json({ mensaje: "Tripulante no encontrado" });

    const asignaciones = await VueloTripulacion.findAll({ where: { id_tripulacion: req.params.id } });

    if (asignaciones.length > 0) {
      return res.status(400).json({
        mensaje: 'No se puede eliminar: el tripulante tiene vuelos asignados. Quita las asignaciones primero.'
      });
    }

    await VueloTripulacion.destroy({ where: { id_tripulacion: req.params.id } });
    await tripulante.destroy();
    res.json({ mensaje: "Tripulante eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar tripulante", error: error.message });
  }
};

// Asignar tripulante a un vuelo
const asignarVuelo = async (req, res) => {
  try {
    const { id_vuelo, rol_en_vuelo } = req.body;
    const existe = await VueloTripulacion.findOne({ where: { id_tripulacion: req.params.id, id_vuelo } });
    if (existe) return res.status(400).json({ mensaje: "El tripulante ya está asignado a ese vuelo" });

    await VueloTripulacion.create({ id_tripulacion: req.params.id, id_vuelo, rol_en_vuelo });
    res.status(201).json({ mensaje: "Tripulante asignado al vuelo exitosamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al asignar vuelo", error: error.message });
  }
};

// Quitar tripulante de un vuelo
const quitarVuelo = async (req, res) => {
  try {
    await VueloTripulacion.destroy({ where: { id_tripulacion: req.params.id, id_vuelo: req.params.id_vuelo } });
    res.json({ mensaje: "Tripulante removido del vuelo exitosamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al quitar vuelo", error: error.message });
  }
};

module.exports = { obtenerTripulacion, obtenerTripulantePorId, crearTripulante, actualizarTripulante, eliminarTripulante, asignarVuelo, quitarVuelo };