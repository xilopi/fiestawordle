const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.fiestawordle_DATABASE_URL);

module.exports = { sql };
