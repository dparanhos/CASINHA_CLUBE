import { Router } from 'express';
import { getPool, sql } from '../config/db.js';

const router = Router();

// GET /api/campanhas
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      'SELECT Id, nome, pontos, descricao FROM dbo.campanhas ORDER BY nome'
    );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/campanhas
router.post('/', async (req, res) => {
  const { nome, pontos, descricao } = req.body;
  if (!nome || pontos === undefined || pontos === null) {
    return res.status(400).json({ error: 'nome e pontos são obrigatórios' });
  }
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('nome', sql.VarChar(50), nome)
      .input('pontos', sql.Int, pontos)
      .input('descricao', sql.NVarChar, descricao || null)
      .query(`
        INSERT INTO dbo.campanhas (nome, pontos, descricao)
        OUTPUT INSERTED.*
        VALUES (@nome, @pontos, @descricao)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/campanhas/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, pontos, descricao } = req.body;
  if (!nome || pontos === undefined || pontos === null) {
    return res.status(400).json({ error: 'nome e pontos são obrigatórios' });
  }
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nome', sql.VarChar(50), nome)
      .input('pontos', sql.Int, pontos)
      .input('descricao', sql.NVarChar, descricao || null)
      .query(`
        UPDATE dbo.campanhas
        SET nome = @nome,
            pontos = @pontos,
            descricao = @descricao
        OUTPUT INSERTED.*
        WHERE Id = @id
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/campanhas/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM dbo.campanhas WHERE Id = @id');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
