// When VITE_USE_MOCK=true (set in .env.local), all calls use the in-memory mock.
// Otherwise, calls go to the real backend at /api/*.

import * as mock from './mockApi';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

// ─── Clientes ────────────────────────────────────────────────────────────────

export function getClientes() {
  if (USE_MOCK) return mock.getClientes();
  return request('/clientes');
}

export function createCliente(data) {
  if (USE_MOCK) return mock.createCliente(data);
  return request('/clientes', { method: 'POST', body: JSON.stringify(data) });
}

export function updateCliente(id, data) {
  if (USE_MOCK) return mock.updateCliente(id, data);
  return request(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteCliente(id) {
  if (USE_MOCK) return mock.deleteCliente(id);
  return request(`/clientes/${id}`, { method: 'DELETE' });
}

// ─── Campanhas ───────────────────────────────────────────────────────────────

export function getCampanhas() {
  if (USE_MOCK) return mock.getCampanhas();
  return request('/campanhas');
}

export function createCampanha(data) {
  if (USE_MOCK) return mock.createCampanha(data);
  return request('/campanhas', { method: 'POST', body: JSON.stringify(data) });
}

export function updateCampanha(id, data) {
  if (USE_MOCK) return mock.updateCampanha(id, data);
  return request(`/campanhas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteCampanha(id) {
  if (USE_MOCK) return mock.deleteCampanha(id);
  return request(`/campanhas/${id}`, { method: 'DELETE' });
}

// ─── Transações ──────────────────────────────────────────────────────────────

export function getTransacoes() {
  if (USE_MOCK) return mock.getTransacoes();
  return request('/transacoes');
}

export function createTransacao(data) {
  if (USE_MOCK) return mock.createTransacao(data);
  return request('/transacoes', { method: 'POST', body: JSON.stringify(data) });
}

export function updateTransacao(id, data) {
  if (USE_MOCK) return mock.updateTransacao(id, data);
  return request(`/transacoes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteTransacao(id) {
  if (USE_MOCK) return mock.deleteTransacao(id);
  return request(`/transacoes/${id}`, { method: 'DELETE' });
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export function getDashboardStats() {
  if (USE_MOCK) return mock.getDashboardStats();
  return request('/dashboard');
}
