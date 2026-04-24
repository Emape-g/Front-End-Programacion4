const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "utn",
  waitForConnections: true,
  connectionLimit: 10,
});

const parseTecnologias = (row) => ({
  ...row,
  tecnologias: typeof row.tecnologias === "string" ? JSON.parse(row.tecnologias) : row.tecnologias ?? [],
});

// GET /participantes — retorna todos los participantes
app.get("/participantes", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM participantes");
    res.json(rows.map(parseTecnologias));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /participantes — crea un participante
app.post("/participantes", async (req, res) => {
  const {
    nombre,
    email,
    edad,
    pais,
    modalidad,
    tecnologias,
    nivel,
    acepta_terminos,
  } = req.body;

  if (!nombre || !email || edad == null || !pais || !modalidad || !nivel) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO participantes
        (nombre, email, edad, pais, modalidad, tecnologias, nivel, acepta_terminos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        email,
        edad,
        pais,
        modalidad,
        JSON.stringify(tecnologias ?? []),
        nivel,
        acepta_terminos ?? false,
      ]
    );
    res.status(201).json(parseTecnologias({ id: result.insertId, ...req.body }));
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El email ya está registrado." });
    }
    res.status(500).json({ error: err.message });
  }
});

// PATCH /participantes/:id — edita parcialmente un participante
app.patch("/participantes/:id", async (req, res) => {
  const { id } = req.params;
  const campos = req.body;

  if (!campos || Object.keys(campos).length === 0) {
    return res.status(400).json({ error: "No se enviaron campos para actualizar." });
  }

  const permitidos = ["nombre", "email", "edad", "pais", "modalidad", "tecnologias", "nivel", "acepta_terminos"];
  const sets = [];
  const valores = [];

  for (const [key, value] of Object.entries(campos)) {
    if (!permitidos.includes(key)) continue;
    sets.push(`${key} = ?`);
    valores.push(key === "tecnologias" ? JSON.stringify(value) : value);
  }

  if (sets.length === 0) {
    return res.status(400).json({ error: "Ningún campo válido para actualizar." });
  }

  valores.push(id);

  try {
    const [result] = await pool.query(
      `UPDATE participantes SET ${sets.join(", ")} WHERE id = ?`,
      valores
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Participante no encontrado." });
    }
    const [rows] = await pool.query("SELECT * FROM participantes WHERE id = ?", [id]);
    res.json(parseTecnologias(rows[0]));
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El email ya está registrado." });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /participantes/:id — elimina un participante por ID
app.delete("/participantes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      "DELETE FROM participantes WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Participante no encontrado." });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
