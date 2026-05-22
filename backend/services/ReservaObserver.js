/**
 * PATRÓN DE DISEÑO: OBSERVER (Comportamiento)
 * Permite que múltiples objetos (observadores) reaccionen
 * automáticamente cuando el estado de una reserva cambia,
 * sin que el objeto principal (reserva) conozca a sus observadores.
 */

/**
 * PRINCIPIO SOLID - OPEN/CLOSED (Abierto/Cerrado):
 * ReservaObserver está abierto para extensión (puedes agregar
 * nuevos observadores como EmailObservador, SMSObservador)
 * pero cerrado para modificación (no necesitas tocar esta clase).
 *
 * PRINCIPIO SOLID - DEPENDENCY INVERSION (Inversión de dependencias):
 * ReservaObserver depende de la abstracción "observador.actualizar()"
 * y no de implementaciones concretas como LogObservador o
 * NotificacionObservador. Esto permite intercambiarlos libremente.
 */
class ReservaObserver {
  constructor() {
    this.observadores = [];
  }

  // Registrar un nuevo observador
  suscribir(observador) {
    this.observadores.push(observador);
  }

  // Eliminar un observador
  desuscribir(observador) {
    this.observadores = this.observadores.filter((o) => o !== observador);
  }

  // Notificar a todos los observadores
  notificar(reserva, estadoAnterior) {
    this.observadores.forEach((observador) => {
      observador.actualizar(reserva, estadoAnterior);
    });
  }
}

/**
 * PRINCIPIO SOLID - LISKOV SUBSTITUTION (Sustitución de Liskov):
 * LogObservador y NotificacionObservador son intercambiables entre sí
 * porque ambos implementan el mismo método actualizar(reserva, estadoAnterior).
 * ReservaObserver puede usar cualquiera sin cambiar su comportamiento.
 */
// Observador que registra cambios en consola
class LogObservador {
  actualizar(reserva, estadoAnterior) {
    console.log(
      `[OBSERVER] Reserva #${reserva.id_reserva} cambió de "${estadoAnterior}" a "${reserva.estado}" — ${new Date().toLocaleString()}`,
    );
  }
}

// Observador que podría enviar notificaciones (extensible)
class NotificacionObservador {
  actualizar(reserva, estadoAnterior) {
    if (reserva.estado === "confirmada") {
      console.log(
        `[OBSERVER] Notificación: Reserva #${reserva.id_reserva} confirmada para pasajero #${reserva.id_pasajero}`,
      );
    }
    if (reserva.estado === "cancelada") {
      console.log(
        `[OBSERVER] Notificación: Reserva #${reserva.id_reserva} cancelada`,
      );
    }
  }
}

// Instancia única del observer con sus observadores registrados
const reservaObserver = new ReservaObserver();
reservaObserver.suscribir(new LogObservador());
reservaObserver.suscribir(new NotificacionObservador());

module.exports = reservaObserver;
