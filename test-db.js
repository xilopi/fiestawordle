const { sql } = require("../lib/db");

module.exports = async (req, res) => {
  try {
    const result = await sql`
      SELECT NOW() AS connected_at
    `;

    res.status(200).json({
      success: true,
      message: "Base de datos conectada correctamente",
      connectedAt: result[0].connected_at
    });
  } catch (error) {
    console.error("Error conectando con la base de datos:", error);

    res.status(500).json({
      success: false,
      message: "Error al conectar con la base de datos"
    });
  }
};
