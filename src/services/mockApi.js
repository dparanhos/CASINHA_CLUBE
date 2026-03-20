// Mock API — in-memory store using DB field names.
// Active when VITE_USE_MOCK=true in .env.local

import { clientesMock, campanhasMock, transacoesMock } from './mockData';

let clientes = [...clientesMock];
let campanhas = [...campanhasMock];
let transacoes = [...transacoesMock];

const delay = (ms = 150) => new Promise(r => setTimeout(r, ms));

let _nextCampanhaId = Math.max(...campanhasMock.map(c => c.Id)) + 1;

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// ─── Clientes ────────────────────────────────────────────────────────────────

export async function getClientes() {
  await delay();
  return [...clientes].sort((a, b) => a.nome_completo.localeCompare(b.nome_completo));
}

export async function createCliente(data) {
  await delay();
  const novo = { ...data, id: uuid(), data_entrada: new Date().toISOString() };
  clientes = [...clientes, novo];
  return novo;
}

export async function updateCliente(id, data) {
  await delay();
  clientes = clientes.map(c => c.id === id ? { ...c, ...data } : c);
  return clientes.find(c => c.id === id);
}

export async function deleteCliente(id) {
  await delay();
  clientes = clientes.filter(c => c.id !== id);
  return { success: true };
}

// ─── Campanhas ───────────────────────────────────────────────────────────────

export async function getCampanhas() {
  await delay();
  return [...campanhas].sort((a, b) => a.nome.localeCompare(b.nome));
}

export async function createCampanha(data) {
  await delay();
  const nova = { ...data, Id: _nextCampanhaId++ };
  campanhas = [...campanhas, nova];
  return nova;
}

export async function updateCampanha(id, data) {
  await delay();
  campanhas = campanhas.map(c => c.Id === id ? { ...c, ...data } : c);
  return campanhas.find(c => c.Id === id);
}

export async function deleteCampanha(id) {
  await delay();
  campanhas = campanhas.filter(c => c.Id !== id);
  return { success: true };
}

// ─── Transações ──────────────────────────────────────────────────────────────

export async function getTransacoes() {
  await delay();
  return [...transacoes].sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora));
}

export async function createTransacao(data) {
  await delay();
  const nova = { ...data, id: uuid(), data_hora: new Date().toISOString() };
  transacoes = [nova, ...transacoes];
  return nova;
}

export async function updateTransacao(id, data) {
  await delay();
  transacoes = transacoes.map(t => t.id === id ? { ...t, ...data } : t);
  return transacoes.find(t => t.id === id);
}

export async function deleteTransacao(id) {
  await delay();
  transacoes = transacoes.filter(t => t.id !== id);
  return { success: true };
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export async function getDashboardStats() {
  await delay();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
  const recentes = transacoes.filter(t => new Date(t.data_hora) >= thirtyDaysAgo);

  const pontosByCliente = {};
  transacoes.filter(t => t.tipo === 'Compra').forEach(t => {
    pontosByCliente[t.id_cliente] = (pontosByCliente[t.id_cliente] || 0) + Number(t.pontos);
  });

  const top10Clientes = Object.entries(pontosByCliente)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id_cliente, total]) => ({
      cliente: clientes.find(c => c.id === id_cliente)?.nome_completo || 'Desconhecido',
      total,
    }));

  return {
    totalClientes: clientes.length,
    pontosCompra30Dias: recentes.filter(t => t.tipo === 'Compra').reduce((sum, t) => sum + Number(t.pontos), 0),
    pontosResgate: transacoes.filter(t => t.tipo === 'Resgate').reduce((sum, t) => sum + Number(t.pontos), 0),
    top10Clientes,
  };
}
