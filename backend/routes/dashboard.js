import { Router } from 'express';
import { getPool } from '../config/db.js';

const router = Router();

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();

    const [totalResult, pontosCompraResult, pontosResgateResult, topResult] = await Promise.all([
      pool.request().query('SELECT COUNT(*) AS total FROM dbo.clientes'),
      pool.request().query(`
        SELECT ISNULL(SUM(pontos), 0) AS total FROM dbo.transacoes
        WHERE tipo = 'Compra' AND data_hora >= DATEADD(day, -30, GETDATE())
      `),
      pool.request().query(`
        SELECT ISNULL(SUM(pontos), 0) AS total FROM dbo.transacoes
        WHERE tipo = 'Resgate'
      `),
      pool.request().query(`
        SELECT TOP 10 c.nome_completo AS cliente, ISNULL(SUM(t.pontos), 0) AS total
        FROM dbo.clientes c
        INNER JOIN dbo.transacoes t ON c.id = t.id_cliente
        WHERE t.tipo = 'Compra'
        GROUP BY c.id, c.nome_completo
        ORDER BY total DESC
      `),
    ]);

    res.json({
      totalClientes: totalResult.recordset[0].total,
      pontosCompra30Dias: Number(pontosCompraResult.recordset[0].total),
      pontosResgate: Number(pontosResgateResult.recordset[0].total),
      top10Clientes: topResult.recordset,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
