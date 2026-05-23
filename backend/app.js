const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
require("dotenv").config();
const { conectarDB } = require("./config/database");
const {
  noAccesoDirectorios,
  verificarTimeout,
} = require("./middlewares/seguridad");
const { verificarSesion } = require("./middlewares/auth");

const app = express();

// Middlewares de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.google.com", "https://www.gstatic.com", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://cdn.datatables.net", "https://code.jquery.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://cdn.datatables.net", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https://www.gstatic.com"],
      frameSrc: ["'self'", "https://www.google.com"],
      connectSrc: ["'self'", "https://app-ee670211-7bf1-4ba5-9265-707f8e6decac.cleverapps.io"],
    }
  }
}))
app.use(noAccesoDirectorios);
app.use(
  cors({
    origin: process.env.FRONTEND_URL 
  ? [process.env.FRONTEND_URL, "http://localhost:5173"] 
  : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token", "x-usuario", "x-session-id"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secreto123",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 5,
    },
  }),
);

// Permitir session ID via header para clientes cross-domain
app.use((req, res, next) => {
    const sessionIdHeader = req.headers['x-session-id']
    if (sessionIdHeader && !req.cookies?.['connect.sid']) {
        req.sessionID = sessionIdHeader
    }
    next()
})

// Verificar timeout de sesión
app.use(verificarTimeout);

// CSRF - generar token en sesión
const crypto = require("crypto");
app.use((req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  }
  next();
});

// CSRF - verificar token en métodos mutantes (excepto rutas públicas)
app.use((req, res, next) => {
  const metodosMutantes = ["POST", "PUT", "DELETE", "PATCH"];
  const rutasExcluidas = ["/api/auth/login", "/api/auth/registro", "/api/auth/csrf-token"];
  if (metodosMutantes.includes(req.method) && !rutasExcluidas.includes(req.originalUrl)) {
    const tokenHeader = req.headers["x-csrf-token"];
    if (!tokenHeader || tokenHeader !== req.session.csrfToken) {
      return res.status(403).json({ mensaje: "Token CSRF inválido" });
    }
  }
  next();
});

// Conectar a la BD
conectarDB();

// Rutas públicas (no requieren sesión)
app.use("/api/auth", require("./routes/auth"));

// Rutas protegidas (requieren sesión)
// Rutas protegidas (requieren sesión)
app.use("/api/vuelos", verificarSesion, require("./routes/vuelos"));
app.use("/api/pasajeros", verificarSesion, require("./routes/pasajeros"));
app.use("/api/reservas", verificarSesion, require("./routes/reservas"));  
app.use("/api/grupos", verificarSesion, require("./routes/grupos"));
app.use("/api/dashboard", verificarSesion, require("./routes/dashboard"));
app.use("/api/rutas", verificarSesion, require("./routes/rutasAereas"));
app.use("/api/aviones", verificarSesion, require("./routes/aviones"));
app.use("/api/asientos", verificarSesion, require("./routes/asientos"));
app.use("/api/tripulacion", verificarSesion, require("./routes/tripulacion"));
app.use("/api/pagos", verificarSesion, require("./routes/pagos")); 


const path = require('path')

// Servir frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  app.get('/{*path}', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
    }
  })
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
