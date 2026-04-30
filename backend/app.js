const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
require("dotenv").config();
const { conectarDB } = require("./config/database"); 

const app = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secreto123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 30,
    },
  }),
);

conectarDB();

// Rutas (se agregan después)
// app.use('/api/auth', require('./routes/autenticacion'));
// app.use('/api/vuelos', require('./routes/vuelos'));
// app.use('/api/pasajeros', require('./routes/pasajeros'));
// app.use('/api/reservas', require('./routes/reservas'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
