import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import clientesRouter from './routes/clientes.js';
import campanhasRouter from './routes/campanhas.js';
import transacoesRouter from './routes/transacoes.js';
import dashboardRouter from './routes/dashboard.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/clientes', clientesRouter);
app.use('/api/campanhas', campanhasRouter);
app.use('/api/transacoes', transacoesRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
