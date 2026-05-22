const { Pasajero, Reserva, ReservaAsiento } = require("../models/index");
const bcrypt = require("bcrypt");
const { validarPasajero } = require("../utils/validadores");

// Crear un pasajero
const crearPasajero = async (req, res) => {
  try {
    const {
      nombre, primer_apellido, segundo_apellido,
      correo, telefono, nacionalidad,
      num_pasaporte, password, genero
    } = req.body;

    const errorValidacion = validarPasajero(req.body);
    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
    }

    const existeCorreo = await Pasajero.findOne({ where: { correo } });
    if (existeCorreo) {
      return res.status(400).json({ mensaje: "El correo ya está registrado." });
    }

    const existePasaporte = await Pasajero.findOne({ where: { num_pasaporte } });
    if (existePasaporte) {
      return res.status(400).json({ mensaje: "El número de pasaporte ya está registrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevo = await Pasajero.create({
      nombre, primer_apellido, segundo_apellido,
      correo, telefono, nacionalidad,
      num_pasaporte, password: hashedPassword, genero
    });

    res.status(201).json({ mensaje: "Pasajero creado exitosamente", pasajero: nuevo });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear pasajero", error: error.message });
  }
};

// Obtener todos los pasajeros
const obtenerPasajeros = async (req, res) => {
  try {
    const pasajeros = await Pasajero.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(pasajeros);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener pasajeros", error: error.message });
  }
};

// Obtener un pasajero por ID
const obtenerPasajeroPorId = async (req, res) => {
  try {
    const pasajero = await Pasajero.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!pasajero) {
      return res.status(404).json({ mensaje: "Pasajero no encontrado" });
    }
    res.json(pasajero);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener pasajero", error: error.message });
  }
};

// Actualizar un pasajero
const actualizarPasajero = async (req, res) => {
  try {
    const pasajero = await Pasajero.findByPk(req.params.id);
    if (!pasajero) {
      return res.status(404).json({ mensaje: "Pasajero no encontrado" });
    }

    const errorValidacion = validarPasajero({ ...pasajero.toJSON(), ...req.body });
    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
    }

    await pasajero.update(req.body);
    res.json({ mensaje: "Pasajero actualizado exitosamente", pasajero });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al actualizar pasajero", error: error.message });
  }
};

// Eliminar un pasajero
const eliminarPasajero = async (req, res) => {
  try {
    const pasajero = await Pasajero.findByPk(req.params.id);
    if (!pasajero) {
      return res.status(404).json({ mensaje: "Pasajero no encontrado" });
    }

    // Verificar si es otro pasajero distinto al logueado
    if (req.session.usuario && req.session.usuario.id !== pasajero.id_pasajero) {
      return res.status(403).json({ mensaje: "No puedes eliminar la cuenta de otro pasajero." });
    }

    const reservaConfirmada = await Reserva.count({
      where: { id_pasajero: req.params.id, estado: "confirmada" }
    });

    const reservaEnEspera = await Reserva.count({
      where: { id_pasajero: req.params.id, estado: "en_espera" }
    });

    if (reservaConfirmada > 0) {
      return res.status(400).json({
        mensaje: `No se puede eliminar: el pasajero tiene ${reservaConfirmada} reserva(s) confirmada(s).`
      });
    }

    if (reservaEnEspera > 0) {
      return res.status(400).json({
        mensaje: `No se puede eliminar: el pasajero tiene ${reservaEnEspera} reserva(s) en espera.`
      });
    }

    // Eliminar registros relacionados antes de borrar el pasajero
    const reservasDePasajero = await Reserva.findAll({ where: { id_pasajero: req.params.id } });
    for (const r of reservasDePasajero) {
      await ReservaAsiento.destroy({ where: { id_reserva: r.id_reserva } });
    }
    await Reserva.destroy({ where: { id_pasajero: req.params.id } });
    await pasajero.destroy();

    // Si eliminó su propia cuenta, cerrar sesión
    if (req.session.usuario && req.session.usuario.id === pasajero.id_pasajero) {
      req.session.destroy();
    }

    res.json({ mensaje: "Pasajero eliminado exitosamente", cuentaPropia: true });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar pasajero", error: error.message });
  }
};

module.exports = { obtenerPasajeros, obtenerPasajeroPorId, crearPasajero, actualizarPasajero, eliminarPasajero };