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
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios"
      });
    }

    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        success: false,
        message: "El nombre de usuario debe tener entre 3 y 30 caracteres"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    const existingUser = await sql`
      SELECT id
      FROM fiestawordle_users
      WHERE username = ${username}
         OR email = ${email}
    `;

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "El nombre de usuario o el email ya están registrados"
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await sql`
      INSERT INTO fiestawordle_users (
        username,
        email,
        password_hash
      )
      VALUES (
        ${username},
        ${email},
        ${passwordHash}
      )
      RETURNING id, username, email, elo, created_at
    `;

    return res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
      user: newUser[0]
    });

  } catch (error) {
    console.error("Error registrando usuario:", error);

    return res.status(500).json({
      success: false,
      message: "Error al registrar el usuario"
    });
  }
};
