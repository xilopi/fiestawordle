const { sql } = require("../lib/db");

module.exports = async (req, res) => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS fiestawordle_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        elo INTEGER NOT NULL DEFAULT 1000,
        games_played INTEGER NOT NULL DEFAULT 0,
        wins INTEGER NOT NULL DEFAULT 0,
        losses INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    res.status(200).json({
      success: true,
      message: "Tabla fiestawordle_users creada correctamente"
    });
  } catch (error) {
    console.error("Error creando la tabla:", error);

    res.status(500).json({
      success: false,
      message: "Error al crear la tabla"
    });
  }
};
