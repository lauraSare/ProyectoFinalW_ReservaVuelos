const { Reserva, Pasajero, Vuelo, Asiento, ReservaAsiento, GrupoReserva, sequelize } = require('../models/index');
const { validarReserva } = require('../utils/validadores');
const reservaObserver = require('../services/ReservaObserver');

// Obtener todas las reservas (con info de pago)
const { Pago } = require('../models/index');
const obtenerReservas = async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      include: [
        { 
          model: Pasajero, 
          attributes: { exclude: ['password'] } 
        },
        { 
          model: Vuelo 
        },
        {
          model: GrupoReserva,
          as: 'GrupoReserva',
          include: [{ model: Pago, as: 'Pago' }]
        }
      ],
      order: [['fecha_reserva', 'DESC']]
    });
    res.json(reservas);
  } catch (error) {
    console.error("ERROR AL CARGAR RESERVAS:", error);
    res.status(500).json({ 
      mensaje: 'Error al obtener reservas', 
      error: error.message 
    });
  }
};

// Obtener una reserva por ID (mejorado con grupo)
const obtenerReservaPorId = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id, {
      include: [
        { model: Pasajero, attributes: { exclude: ['password'] } },
        { model: Vuelo },
        { model: ReservaAsiento, include: [{ model: Asiento }] },
        { 
          model: GrupoReserva,
          include: [{ model: Pago, as: 'Pago' }]
        }
      ]
    });
    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }
    res.json(reserva);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener reserva', error: error.message });
  }
};

// Crear una reserva (soporta individual y grupal)
const crearReserva = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_grupo, id_vuelo, id_pasajero, id_asiento, precio, tipo_reserva } = req.body;

    // Validar primero ANTES de crear nada
    const errorValidacion = validarReserva(req.body);
    if (errorValidacion) {
      await t.rollback();
      return res.status(400).json({ mensaje: errorValidacion });
    }

    // Verificar que el pasajero no tenga ya una reserva activa en ese vuelo
    const reservaExistente = await Reserva.findOne({
      where: {
        id_pasajero,
        id_vuelo,
        estado: ['confirmada', 'en_espera']
      },
      transaction: t
    });
    if (reservaExistente) {
      await t.rollback();
      return res.status(400).json({ 
        mensaje: 'Este pasajero ya tiene una reserva activa en ese vuelo.' 
      });
    }

    let grupoReserva;

    if (id_grupo) {
      grupoReserva = await GrupoReserva.findByPk(id_grupo, { transaction: t });
      if (!grupoReserva) throw new Error("Grupo de reserva no encontrado");
    } else {
      grupoReserva = await GrupoReserva.create({
        descripcion: tipo_reserva || 'Reserva individual',
        fecha_creacion: new Date(),
        id_pasajero_responsable: id_pasajero
      }, { transaction: t });
    }

    const nuevaReserva = await Reserva.create({
      fecha_reserva: new Date(),
      estado: "en_espera",
      id_vuelo,
      id_pasajero,
      id_grupo: grupoReserva.id_grupo
    }, { transaction: t });

    // Asignar asiento
    await ReservaAsiento.create({
      precio: precio || 1500,
      id_reserva: nuevaReserva.id_reserva,
      id_asiento
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      mensaje: "Reserva creada exitosamente",
      reserva: nuevaReserva,
      id_grupo: grupoReserva.id_grupo
    });

  } catch (error) {
    await t.rollback();
    console.error("ERROR CREAR RESERVA:", error);
    res.status(500).json({ 
      mensaje: "Error al crear reserva", 
      error: error.message 
    });
  }
};
// Actualizar una reserva
const actualizarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    const estadoAnterior = reserva.estado;
    await reserva.update(req.body);
    reservaObserver.notificar(reserva, estadoAnterior);
    res.json({ mensaje: 'Reserva actualizada exitosamente', reserva });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar reserva', error: error.message });
  }
};

// Eliminar una reserva
const eliminarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    if (reserva.estado === 'confirmada') {
      return res.status(400).json({ mensaje: 'No se puede eliminar una reserva confirmada. Primero cámbiala a cancelada.' });
    }

    if (reserva.estado === 'en_espera') {
      return res.status(400).json({ mensaje: 'No se puede eliminar una reserva en espera. Primero cámbiala a cancelada.' });
    }

    // Eliminar primero los asientos de la reserva
    await ReservaAsiento.destroy({ where: { id_reserva: req.params.id } });

    // Luego eliminar la reserva
    await reserva.destroy();
    res.json({ mensaje: 'Reserva eliminada exitosamente' });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar reserva', error: error.message });
  }
};
/**
 * PRINCIPIO SOLID - INTERFACE SEGREGATION (Segregación de interfaces):
 * Este controller exporta únicamente las funciones que las rutas
 * de reservas necesitan. Ningún otro módulo recibe métodos que
 * no le corresponden — pasajeroController, vueloController y
 * tripulacionController exportan sus propias funciones de forma
 * independiente, sin acoplarse entre sí.
 */
module.exports = { obtenerReservas, obtenerReservaPorId, crearReserva, actualizarReserva, eliminarReserva };