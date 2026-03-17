import { useEffect, useState } from 'react';
import { getTransacoes, getClientes, getCampanhas, deleteTransacao } from '../../services/api';
import './TransacoesPage.css';

const STATUS_ALL = 'Todos';
const TIPO_ALL = 'Todos';

export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [campanhas, setCampanhas] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState(STATUS_ALL);
  const [filterTipo, setFilterTipo] = useState(TIPO_ALL);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    getTransacoes().then(setTransacoes);
    getClientes().then(setClientes);
    getCampanhas().then(setCampanhas);
  };

  useEffect(() => { load(); }, []);

  const clienteNome = id => clientes.find(c => c.id === id)?.nome || '—';
  const campanhaNome = id => id ? campanhas.find(c => c.id === id)?.nome || '—' : '—';

  const filtered = transacoes.filter(t => {
    const nome = clienteNome(t.cliente_id).toLowerCase();
    const matchSearch = nome.includes(search.toLowerCase()) || t.descricao?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === STATUS_ALL || t.status === filterStatus;
    const matchTipo = filterTipo === TIPO_ALL || t.tipo === filterTipo;
    return matchSearch && matchStatus && matchTipo;
  });

  const total = filtered.reduce((sum, t) => sum + (t.valor || 0), 0);

  const handleDelete = async id => {
    if (!window.confirm('Remover esta transação?')) return;
    setDeleting(id);
    await deleteTransacao(id);
    load();
    setDeleting(null);
  };

  const formatDate = iso => {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Transações</h1>
        <span className="total-label">
          Total filtrado: <strong>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
        </span>
      </div>

      <div className="card">
        <div className="filters-bar">
          <input
            className="search-bar"
            style={{ flex: 1, marginBottom: 0 }}
            placeholder="Buscar por cliente ou descrição…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="filter-select" value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
            <option value={TIPO_ALL}>Todos os tipos</option>
            <option>Compra</option>
            <option>Resgate</option>
            <option>Bônus</option>
          </select>
          <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value={STATUS_ALL}>Todos os status</option>
            <option>Concluída</option>
            <option>Pendente</option>
            <option>Cancelada</option>
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Campanha</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="empty">Nenhuma transação encontrada.</td></tr>
            )}
            {filtered.map(t => (
              <tr key={t.id}>
                <td className="date-cell">{formatDate(t.data_transacao)}</td>
                <td><strong>{clienteNome(t.cliente_id)}</strong></td>
                <td>{campanhaNome(t.campanha_id)}</td>
                <td><span className={`badge tipo-${t.tipo.toLowerCase().replace('ô', 'o')}`}>{t.tipo}</span></td>
                <td className="valor-cell">R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>{t.descricao || '—'}</td>
                <td><span className={`badge ${statusBadge(t.status)}`}>{t.status}</span></td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(t.id)}
                    disabled={deleting === t.id}
                  >
                    {deleting === t.id ? '…' : 'Remover'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="table-count">{filtered.length} registro(s)</p>
      </div>
    </div>
  );
}

function statusBadge(status) {
  const map = { 'Concluída': 'badge-green', 'Pendente': 'badge-yellow', 'Cancelada': 'badge-red' };
  return map[status] || 'badge-gray';
}
