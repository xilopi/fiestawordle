const { sql } = require("../lib/db");
const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Método no permitido"
    });
  }

  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Usuario/email y contraseña son obligatorios"
      });
    }

    const users = await sql`
      SELECT id, username, email, password_hash, elo
      FROM fiestawordle_users
      WHERE username = ${identifier}
         OR email = ${identifier}
      LIMIT 1
    `;

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Usuario o contraseña incorrectos"
      });
    }

    const user = users[0];

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Usuario o contraseña incorrectos"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inicio de sesión correcto",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        elo: user.elo
      }
    });

  } catch (error) {
    console.error("Error iniciando sesión:", error);

    return res.status(500).json({
      success: false,
      message: "Error al iniciar sesión"
    });
  }
};
