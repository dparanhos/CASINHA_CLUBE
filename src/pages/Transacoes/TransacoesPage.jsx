import { useEffect, useState } from 'react';
import { getTransacoes, getClientes, deleteTransacao } from '../../services/api';
import './TransacoesPage.css';

const TIPO_ALL = 'Todos';

export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState(TIPO_ALL);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    getTransacoes().then(setTransacoes);
    getClientes().then(setClientes);
  };

  useEffect(() => { load(); }, []);

  const clienteNome = id => clientes.find(c => c.id === id)?.nome_completo || '—';

  const filtered = transacoes.filter(t => {
    const nome = clienteNome(t.id_cliente).toLowerCase();
    const matchSearch = nome.includes(search.toLowerCase()) || t.detalhes?.toLowerCase().includes(search.toLowerCase());
    const matchTipo = filterTipo === TIPO_ALL || t.tipo === filterTipo;
    return matchSearch && matchTipo;
  });

  const total = filtered.reduce((sum, t) => sum + (Number(t.total_compra) || 0), 0);

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
            placeholder="Buscar por cliente ou detalhes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="filter-select" value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
            <option value={TIPO_ALL}>Todos os tipos</option>
            <option>Compra</option>
            <option>Resgate</option>
            <option>Bônus</option>
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Pontos</th>
              <th>Total Compra</th>
              <th>Detalhes</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="empty">Nenhuma transação encontrada.</td></tr>
            )}
            {filtered.map(t => (
              <tr key={t.id}>
                <td className="date-cell">{formatDate(t.data_hora)}</td>
                <td><strong>{clienteNome(t.id_cliente)}</strong></td>
                <td><span className={`badge tipo-${t.tipo.toLowerCase().replace('ô', 'o')}`}>{t.tipo}</span></td>
                <td>{t.pontos}</td>
                <td className="valor-cell">R$ {Number(t.total_compra).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>{t.detalhes || '—'}</td>
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
