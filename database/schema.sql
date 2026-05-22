-- ================================================
-- SISTEMA DE RESERVA DE VUELOS — Quetzal
-- Base de datos: reserva_vuelos
-- NOTA: Ejecutar solo si la BD no existe aun
-- ================================================

CREATE DATABASE IF NOT EXISTS reserva_vuelos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE reserva_vuelos;

-- ================================================
-- TABLA: aeropuertos
-- ================================================
CREATE TABLE IF NOT EXISTS aeropuertos (
  id_aeropuerto INT PRIMARY KEY AUTO_INCREMENT,
  codigo_iata   VARCHAR(3)   NOT NULL UNIQUE,
  nombre        VARCHAR(100) NOT NULL,
  ciudad        VARCHAR(45)  NOT NULL,
  pais          VARCHAR(45)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLA: aviones
-- ================================================
CREATE TABLE IF NOT EXISTS aviones (
  id_avion        INT PRIMARY KEY AUTO_INCREMENT,
  matricula       VARCHAR(45) NOT NULL UNIQUE,
  modelo          VARCHAR(45) NOT NULL,
  fabricante      VARCHAR(45) NOT NULL,
  capacidad_total INT         NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLA: rutas
-- ================================================
CREATE TABLE IF NOT EXISTS rutas (
  id_ruta           INT PRIMARY KEY AUTO_INCREMENT,
  distancia_km      DECIMAL(10,2) NOT NULL,
  duracion_estimada TIME          NOT NULL,
  id_origen         INT           NOT NULL,
  id_destino        INT           NOT NULL,
  FOREIGN KEY (id_origen)  REFERENCES aeropuertos(id_aeropuerto),
  FOREIGN KEY (id_destino) REFERENCES aeropuertos(id_aeropuerto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLA: vuelos
-- ================================================
CREATE TABLE IF NOT EXISTS vuelos (
  id_vuelo      INT PRIMARY KEY AUTO_INCREMENT,
  codigo_vuelo  VARCHAR(45) NOT NULL UNIQUE,
  fecha_salida  DATETIME    NOT NULL,
  fecha_llegada DATETIME    NOT NULL,
  estado        ENUM('programado','retrasado','cancelado','completado') NOT NULL DEFAULT 'programado',
  id_ruta       INT NOT NULL,
  id_avion      INT NOT NULL,
  FOREIGN KEY (id_ruta)  REFERENCES rutas(id_ruta),
  FOREIGN KEY (id_avion) REFERENCES aviones(id_avion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLA: asientos
-- ================================================
CREATE TABLE IF NOT EXISTS asientos (
  id_asiento     INT PRIMARY KEY AUTO_INCREMENT,
  numero_asiento VARCHAR(45) NOT NULL,
  clase          ENUM('turista','ejecutiva','primera_clase') NOT NULL,
  id_avion       INT NOT NULL,
  FOREIGN KEY (id_avion) REFERENCES aviones(id_avion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLA: vuelo_asientos
-- ================================================
CREATE TABLE IF NOT EXISTS vuelo_asientos (
  id_vuelo   INT NOT NULL,
  id_asiento INT NOT NULL,
  estado     ENUM('disponible','ocupado','bloqueado') NOT NULL DEFAULT 'disponible',
  PRIMARY KEY (id_vuelo, id_asiento),
  FOREIGN KEY (id_vuelo)   REFERENCES vuelos(id_vuelo),
  FOREIGN KEY (id_asiento) REFERENCES asientos(id_asiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLA: pasajeros
-- ================================================
CREATE TABLE IF NOT EXISTS pasajeros (
  id_pasajero      INT PRIMARY KEY AUTO_INCREMENT,
  nombre           VARCHAR(45)  NOT NULL,
  primer_apellido  VARCHAR(45)  NOT NULL,
  segundo_apellido VARCHAR(45)  NULL,
  correo           VARCHAR(45)  NOT NULL UNIQUE,
  telefono         VARCHAR(45)  NULL,
  nacionalidad     VARCHAR(45)  NULL,
  num_pasaporte    VARCHAR(45)  NOT NULL UNIQUE,
  password         VARCHAR(255) NOT NULL,
  genero           ENUM('masculino','femenino') NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLA: tripulacion
-- ================================================
CREATE TABLE IF NOT EXISTS tripulacion (
  id_tripulacion   INT PRIMARY KEY AUTO_INCREMENT,
  nombre           VARCHAR(45) NOT NULL,
  primer_apellido  VARCHAR(45) NOT NULL,
  segundo_apellido VARCHAR(45) NULL,
  nacionalidad     VARCHAR(45) NOT NULL,
  rol              ENUM('piloto','copiloto','auxiliar') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLA: vuelo_tripulacion
-- ================================================
CREATE TABLE IF NOT EXISTS vuelo_tripulacion (
  id_vuelo       INT NOT NULL,
  id_tripulacion INT NOT NULL,
  rol_en_vuelo   ENUM('piloto','copiloto','auxiliar') NOT NULL,
  PRIMARY KEY (id_vuelo, id_tripulacion),
  FOREIGN KEY (id_vuelo)       REFERENCES vuelos(id_vuelo),
  FOREIGN KEY (id_tripulacion) REFERENCES tripulacion(id_tripulacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLA: pagos
-- ================================================
CREATE TABLE IF NOT EXISTS pagos (
  id_pago           INT PRIMARY KEY AUTO_INCREMENT,
  metodo            ENUM('tarjeta','transferencia','puntos') NOT NULL,
  monto_total       DECIMAL(10,2) NOT NULL,
  moneda            VARCHAR(10)   NOT NULL DEFAULT 'MXN',
  fecha_transaccion DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado            ENUM('pendiente','completado','fallido') NOT NULL DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLA: grupo_reserva
-- ================================================
CREATE TABLE IF NOT EXISTS grupo_reserva (
  id_grupo                INT PRIMARY KEY AUTO_INCREMENT,
  descripcion             VARCHAR(100) NULL,
  fecha_creacion          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_pasajero_responsable INT          NOT NULL,
  id_pago                 INT          NULL,
  FOREIGN KEY (id_pasajero_responsable) REFERENCES pasajeros(id_pasajero),
  FOREIGN KEY (id_pago)                 REFERENCES pagos(id_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLA: reservas
-- ================================================
CREATE TABLE IF NOT EXISTS reservas (
  id_reserva    INT PRIMARY KEY AUTO_INCREMENT,
  fecha_reserva DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado        ENUM('confirmada','cancelada','en_espera') NOT NULL DEFAULT 'en_espera',
  id_vuelo      INT NOT NULL,
  id_pasajero   INT NOT NULL,
  id_grupo      INT NULL,
  FOREIGN KEY (id_vuelo)    REFERENCES vuelos(id_vuelo),
  FOREIGN KEY (id_pasajero) REFERENCES pasajeros(id_pasajero),
  FOREIGN KEY (id_grupo)    REFERENCES grupo_reserva(id_grupo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLA: reserva_asiento
-- ================================================
CREATE TABLE IF NOT EXISTS reserva_asiento (
  id_reserva_asiento INT PRIMARY KEY AUTO_INCREMENT,
  precio             DECIMAL(10,2) NOT NULL,
  id_reserva         INT NOT NULL,
  id_asiento         INT NOT NULL,
  FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva),
  FOREIGN KEY (id_asiento) REFERENCES asientos(id_asiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;