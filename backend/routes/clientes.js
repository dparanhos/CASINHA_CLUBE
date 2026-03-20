import { Router } from 'express';
import { getPool, sql } from '../config/db.js';

const router = Router();

// GET /api/clientes
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      'SELECT id, nome_completo, cpf, email, whatsapp, cep, data_entrada FROM dbo.clientes ORDER BY nome_completo'
    );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/clientes
router.post('/', async (req, res) => {
  const { nome_completo, cpf, email, whatsapp, cep } = req.body;
  if (!nome_completo || !cpf || !whatsapp) {
    return res.status(400).json({ error: 'nome_completo, cpf e whatsapp são obrigatórios' });
  }
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('nome_completo', sql.NVarChar, nome_completo)
      .input('cpf', sql.BigInt, cpf)
      .input('email', sql.VarChar, email || null)
      .input('whatsapp', sql.BigInt, whatsapp)
      .input('cep', sql.BigInt, cep || null)
      .query(`
        INSERT INTO dbo.clientes (nome_completo, cpf, email, whatsapp, cep)
        OUTPUT INSERTED.*
        VALUES (@nome_completo, @cpf, @email, @whatsapp, @cep)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/clientes/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome_completo, cpf, email, whatsapp, cep } = req.body;
  if (!nome_completo || !cpf || !whatsapp) {
    return res.status(400).json({ error: 'nome_completo, cpf e whatsapp são obrigatórios' });
  }
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('nome_completo', sql.NVarChar, nome_completo)
      .input('cpf', sql.BigInt, cpf)
      .input('email', sql.VarChar, email || null)
      .input('whatsapp', sql.BigInt, whatsapp)
      .input('cep', sql.BigInt, cep || null)
      .query(`
        UPDATE dbo.clientes
        SET nome_completo = @nome_completo,
            cpf = @cpf,
            email = @email,
            whatsapp = @whatsapp,
            cep = @cep
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/clientes/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .query('DELETE FROM dbo.clientes WHERE id = @id');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
