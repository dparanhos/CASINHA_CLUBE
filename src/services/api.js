// API Service Layer - mock implementation using in-memory store.
// Replace each function body with real fetch() calls once the backend is ready.

import { clientesMock, campanhasMock, transacoesMock } from './mockData';

let clientes = [...clientesMock];
let campanhas = [...campanhasMock];
let transacoes = [...transacoesMock];

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

// ─── Clientes ────────────────────────────────────────────────────────────────

export async function getClientes() {
  await delay();
  return [...clientes];
}

export async function createCliente(data) {
  await delay();
  const novo = { ...data, id: Date.now(), data_cadastro: new Date().toISOString().split('T')[0], ativo: true };
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
  return [...campanhas];
}

export async function createCampanha(data) {
  await delay();
  const nova = { ...data, id: Date.now() };
  campanhas = [...campanhas, nova];
  return nova;
}

export async function updateCampanha(id, data) {
  await delay();
  campanhas = campanhas.map(c => c.id === id ? { ...c, ...data } : c);
  return campanhas.find(c => c.id === id);
}

export async function deleteCampanha(id) {
  await delay();
  campanhas = campanhas.filter(c => c.id !== id);
  return { success: true };
}

// ─── Transações ──────────────────────────────────────────────────────────────

export async function getTransacoes() {
  await delay();
  return [...transacoes].sort((a, b) => new Date(b.data_transacao) - new Date(a.data_transacao));
}

export async function createTransacao(data) {
  await delay();
  const nova = { ...data, id: Date.now(), data_transacao: new Date().toISOString() };
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

// ─── Dashboard stats ─────────────────────────────────────────────────────────

export async function getDashboardStats() {
  await delay();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);

  const transacoesRecentes = transacoes.filter(
    t => new Date(t.data_transacao) >= thirtyDaysAgo
  );

  const countByCliente = {};
  transacoes.forEach(t => {
    countByCliente[t.cliente_id] = (countByCliente[t.cliente_id] || 0) + 1;
  });

  const top10 = Object.entries(countByCliente)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([clienteId, total]) => {
      const cliente = clientes.find(c => c.id === Number(clienteId));
      return { cliente: cliente?.nome || 'Desconhecido', total };
    });

  return {
    totalClientes: clientes.filter(c => c.ativo).length,
    transacoesUltimos30Dias: transacoesRecentes.length,
    valorUltimos30Dias: transacoesRecentes.reduce((sum, t) => sum + t.valor, 0),
    top10Clientes: top10,
  };
}
