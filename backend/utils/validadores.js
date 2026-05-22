/**
 * PRINCIPIO SOLID - SINGLE RESPONSIBILITY (Responsabilidad Única):
 * Este módulo tiene una única responsabilidad: centralizar
 * todas las funciones de validación del backend.
 * Los controllers no validan datos directamente, delegan aquí.
 */

// Validar datos de pasajero
const validarPasajero = (datos) => {
  const { nombre, primer_apellido, correo, num_pasaporte, password } = datos;

  if (!nombre || !nombre.trim()) return "El nombre es obligatorio.";

  if (!primer_apellido || !primer_apellido.trim())
    return "El primer apellido es obligatorio.";

  const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!correo || !correo.trim()) return "El correo es obligatorio.";
  if (!regexCorreo.test(correo.trim()))
    return "El correo no tiene un formato válido.";

  const regexPasaporte = /^[A-Z]{2}[0-9]{6,9}$/;
  if (!num_pasaporte || !num_pasaporte.trim())
    return "El número de pasaporte es obligatorio.";
  if (!regexPasaporte.test(num_pasaporte.trim().toUpperCase()))
    return "El pasaporte debe tener 2 letras mayúsculas y entre 6 y 9 números. Ejemplo: MX1234567";

  if (password !== undefined && password.length < 8)
    return "La contraseña debe tener mínimo 8 caracteres.";

  return null;
};

// Validar datos de vuelo
const validarVuelo = (datos) => {
  const { codigo_vuelo, fecha_salida, fecha_llegada, id_ruta, id_avion } = datos;

  if (codigo_vuelo !== undefined) {
    const regexCodigo = /^[A-Z]{2}-[0-9]{3,4}$/;
    if (!codigo_vuelo.trim())
      return "El código de vuelo es obligatorio.";
    if (!regexCodigo.test(codigo_vuelo.trim().toUpperCase()))
      return "El código debe tener el formato XX-000 o XX-0000. Ejemplo: QZ-001";
  }

  if (fecha_salida && fecha_llegada) {
    if (new Date(fecha_llegada) <= new Date(fecha_salida))
      return "La fecha de llegada debe ser posterior a la fecha de salida.";
  }

  return null;
};

// Validar datos de tripulante
const validarTripulante = (datos) => {
  const { nombre, primer_apellido, nacionalidad, rol } = datos;

  if (!nombre || !nombre.trim()) return "El nombre es obligatorio.";

  if (!primer_apellido || !primer_apellido.trim())
    return "El primer apellido es obligatorio.";

  if (!nacionalidad || !nacionalidad.trim())
    return "La nacionalidad es obligatoria.";

  const rolesValidos = ["piloto", "copiloto", "auxiliar"];
  if (!rol || !rolesValidos.includes(rol))
    return "El rol debe ser piloto, copiloto o auxiliar.";

  return null;
};

// Validar datos de reserva
const validarReserva = (datos) => {
  const { id_vuelo, id_pasajero, id_asiento } = datos;

  if (!id_vuelo) return "El vuelo es obligatorio.";

  if (!id_pasajero) return "El pasajero es obligatorio.";

  if (!id_asiento) return "El asiento es obligatorio.";

  return null;
};

module.exports = {
  validarPasajero,
  validarVuelo,
  validarTripulante,
  validarReserva,
};
