import { Router } from 'express';
import { getPool, sql } from '../config/db.js';

const router = Router();

// GET /api/transacoes
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      'SELECT id, data_hora, id_cliente, tipo, pontos, total_compra, detalhes FROM dbo.transacoes ORDER BY data_hora DESC'
    );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/transacoes
router.post('/', async (req, res) => {
  const { id_cliente, tipo, pontos, total_compra, detalhes } = req.body;
  if (!id_cliente || !tipo || pontos === undefined || total_compra === undefined) {
    return res.status(400).json({ error: 'id_cliente, tipo, pontos e total_compra são obrigatórios' });
  }
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_cliente', sql.UniqueIdentifier, id_cliente)
      .input('tipo', sql.VarChar(50), tipo)
      .input('pontos', sql.BigInt, pontos)
      .input('total_compra', sql.Decimal(18, 2), total_compra)
      .input('detalhes', sql.NText, detalhes || null)
      .query(`
        INSERT INTO dbo.transacoes (id_cliente, tipo, pontos, total_compra, detalhes)
        OUTPUT INSERTED.*
        VALUES (@id_cliente, @tipo, @pontos, @total_compra, @detalhes)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/transacoes/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { id_cliente, tipo, pontos, total_compra, detalhes } = req.body;
  if (!id_cliente || !tipo || pontos === undefined || total_compra === undefined) {
    return res.status(400).json({ error: 'id_cliente, tipo, pontos e total_compra são obrigatórios' });
  }
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('id_cliente', sql.UniqueIdentifier, id_cliente)
      .input('tipo', sql.VarChar(50), tipo)
      .input('pontos', sql.BigInt, pontos)
      .input('total_compra', sql.Decimal(18, 2), total_compra)
      .input('detalhes', sql.NText, detalhes || null)
      .query(`
        UPDATE dbo.transacoes
        SET id_cliente = @id_cliente,
            tipo = @tipo,
            pontos = @pontos,
            total_compra = @total_compra,
            detalhes = @detalhes
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/transacoes/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .query('DELETE FROM dbo.transacoes WHERE id = @id');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
