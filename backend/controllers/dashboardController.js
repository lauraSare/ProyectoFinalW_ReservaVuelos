const dashboardFacade = require("../services/DashboardFacade");

const obtenerEstadisticas = async (req, res) => {
  try {
    const estadisticas = await dashboardFacade.obtenerEstadisticasCompletas();
    res.json(estadisticas);
  } catch (error) {
    res.status(500).json({ 
      mensaje: "Error al obtener estadísticas", 
      error: error.message 
    });
  }
};

module.exports = { obtenerEstadisticas };
