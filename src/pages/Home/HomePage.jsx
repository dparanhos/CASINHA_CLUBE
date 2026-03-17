import { useEffect, useState } from 'react';
import { getDashboardStats, getClientes, getCampanhas, createCliente, createTransacao } from '../../services/api';
import './HomePage.css';

const emptyCliente = { nome: '', email: '', telefone: '', cpf: '', data_nascimento: '' };
const emptyTransacao = { cliente_id: '', campanha_id: '', valor: '', tipo: 'Compra', descricao: '', status: 'Concluída' };

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [campanhas, setCampanhas] = useState([]);
  const [clienteForm, setClienteForm] = useState(emptyCliente);
  const [transacaoForm, setTransacaoForm] = useState(emptyTransacao);
  const [savingC, setSavingC] = useState(false);
  const [savingT, setSavingT] = useState(false);
  const [msgC, setMsgC] = useState('');
  const [msgT, setMsgT] = useState('');

  useEffect(() => {
    getDashboardStats().then(setStats);
    getClientes().then(setClientes);
    getCampanhas().then(setCampanhas);
  }, []);

  const handleClienteSubmit = async e => {
    e.preventDefault();
    setSavingC(true);
    await createCliente(clienteForm);
    const updated = await getDashboardStats();
    setStats(updated);
    getClientes().then(setClientes);
    setClienteForm(emptyCliente);
    setMsgC('Cliente cadastrado com sucesso!');
    setSavingC(false);
    setTimeout(() => setMsgC(''), 3000);
  };

  const handleTransacaoSubmit = async e => {
    e.preventDefault();
    setSavingT(true);
    await createTransacao({
      ...transacaoForm,
      cliente_id: Number(transacaoForm.cliente_id),
      campanha_id: transacaoForm.campanha_id ? Number(transacaoForm.campanha_id) : null,
      valor: parseFloat(transacaoForm.valor),
    });
    const updated = await getDashboardStats();
    setStats(updated);
    setTransacaoForm(emptyTransacao);
    setMsgT('Transação registrada com sucesso!');
    setSavingT(false);
    setTimeout(() => setMsgT(''), 3000);
  };

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard label="Clientes Ativos" value={stats?.totalClientes ?? '…'} icon="👥" color="#3b82f6" />
        <StatCard label="Transações (30 dias)" value={stats?.transacoesUltimos30Dias ?? '…'} icon="💳" color="#10b981" />
        <StatCard
          label="Volume (30 dias)"
          value={stats ? `R$ ${stats.valorUltimos30Dias.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '…'}
          icon="💰"
          color="#f59e0b"
        />
      </div>

      {/* Top 10 table */}
      <div className="card" style={{ marginBottom: 32 }}>
        <h2 className="card-title">Top 10 Clientes por Transações</h2>
        <table className="table">
          <thead>
            <tr><th>#</th><th>Cliente</th><th>Total de Transações</th></tr>
          </thead>
          <tbody>
            {stats?.top10Clientes?.map((row, i) => (
              <tr key={i}>
                <td className="rank">#{i + 1}</td>
                <td>{row.cliente}</td>
                <td><span className="badge badge-blue">{row.total}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Forms */}
      <div className="forms-grid">
        {/* New Client */}
        <div className="card">
          <h2 className="card-title">Novo Cliente</h2>
          <form onSubmit={handleClienteSubmit} className="form">
            <div className="form-row">
              <label>Nome *</label>
              <input required value={clienteForm.nome} onChange={e => setClienteForm({ ...clienteForm, nome: e.target.value })} placeholder="Nome completo" />
            </div>
            <div className="form-row">
              <label>E-mail</label>
              <input type="email" value={clienteForm.email} onChange={e => setClienteForm({ ...clienteForm, email: e.target.value })} placeholder="email@exemplo.com" />
            </div>
            <div className="form-row">
              <label>Telefone</label>
              <input value={clienteForm.telefone} onChange={e => setClienteForm({ ...clienteForm, telefone: e.target.value })} placeholder="(11) 99999-9999" />
            </div>
            <div className="form-row">
              <label>CPF</label>
              <input value={clienteForm.cpf} onChange={e => setClienteForm({ ...clienteForm, cpf: e.target.value })} placeholder="000.000.000-00" />
            </div>
            <div className="form-row">
              <label>Data de Nascimento</label>
              <input type="date" value={clienteForm.data_nascimento} onChange={e => setClienteForm({ ...clienteForm, data_nascimento: e.target.value })} />
            </div>
            {msgC && <p className="form-success">{msgC}</p>}
            <button className="btn btn-primary" type="submit" disabled={savingC}>
              {savingC ? 'Salvando…' : 'Cadastrar Cliente'}
            </button>
          </form>
        </div>

        {/* New Transaction */}
        <div className="card">
          <h2 className="card-title">Nova Transação</h2>
          <form onSubmit={handleTransacaoSubmit} className="form">
            <div className="form-row">
              <label>Cliente *</label>
              <select required value={transacaoForm.cliente_id} onChange={e => setTransacaoForm({ ...transacaoForm, cliente_id: e.target.value })}>
                <option value="">Selecione um cliente</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Campanha</label>
              <select value={transacaoForm.campanha_id} onChange={e => setTransacaoForm({ ...transacaoForm, campanha_id: e.target.value })}>
                <option value="">Nenhuma</option>
                {campanhas.filter(c => c.status === 'Ativa').map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Valor (R$) *</label>
              <input required type="number" step="0.01" min="0" value={transacaoForm.valor} onChange={e => setTransacaoForm({ ...transacaoForm, valor: e.target.value })} placeholder="0,00" />
            </div>
            <div className="form-row">
              <label>Tipo *</label>
              <select value={transacaoForm.tipo} onChange={e => setTransacaoForm({ ...transacaoForm, tipo: e.target.value })}>
                <option>Compra</option>
                <option>Resgate</option>
                <option>Bônus</option>
              </select>
            </div>
            <div className="form-row">
              <label>Status</label>
              <select value={transacaoForm.status} onChange={e => setTransacaoForm({ ...transacaoForm, status: e.target.value })}>
                <option>Concluída</option>
                <option>Pendente</option>
                <option>Cancelada</option>
              </select>
            </div>
            <div className="form-row">
              <label>Descrição</label>
              <input value={transacaoForm.descricao} onChange={e => setTransacaoForm({ ...transacaoForm, descricao: e.target.value })} placeholder="Descrição opcional" />
            </div>
            {msgT && <p className="form-success">{msgT}</p>}
            <button className="btn btn-primary" type="submit" disabled={savingT}>
              {savingT ? 'Salvando…' : 'Registrar Transação'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card" style={{ '--accent': color }}>
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
