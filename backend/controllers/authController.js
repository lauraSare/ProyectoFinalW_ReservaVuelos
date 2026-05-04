const bcrypt = require('bcrypt');
const { Pasajero } = require('../models/index');

// Registro de nuevo pasajero
const registro = async (req, res) => {
  try {
    const { 
      nombre, 
      primer_apellido, 
      segundo_apellido, 
      correo, 
      telefono, 
      nacionalidad, 
      num_pasaporte, 
      password 
    } = req.body;

    // Verificar si el correo ya existe
    const existe = await Pasajero.findOne({ where: { correo } });
    if (existe) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear pasajero
    const nuevoPasajero = await Pasajero.create({
      nombre,
      primer_apellido,
      segundo_apellido,
      correo,
      telefono,
      nacionalidad,
      num_pasaporte,
      password: hashedPassword
    });

    res.status(201).json({ 
      mensaje: 'Registro exitoso', 
      id: nuevoPasajero.id_pasajeros 
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

module.exports = { registro };