import { useEffect, useState } from 'react';
import { getDashboardStats, getClientes, getCampanhas, createCliente, createTransacao } from '../../services/api';
import './HomePage.css';

const emptyCliente = { nome_completo: '', cpf: '', email: '', whatsapp: '', cep: '' };
const emptyCompra  = { id_cliente: '', campanha_id: '', total_compra: '', detalhes: '' };
const emptyResgate = { id_cliente: '', pontos: '', detalhes: '' };
const emptyBonus   = { id_cliente: '', pontos: '', detalhes: '' };

function maskCpf(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function maskWhatsapp(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
}

export default function HomePage() {
  const [stats, setStats]         = useState(null);
  const [clientes, setClientes]   = useState([]);
  const [campanhas, setCampanhas] = useState([]);

  // Novo Cliente
  const [clienteForm, setClienteForm]         = useState(emptyCliente);
  const [cpfDisplay, setCpfDisplay]           = useState('');
  const [whatsappDisplay, setWhatsappDisplay] = useState('');
  const [savingC, setSavingC]                 = useState(false);
  const [msgC, setMsgC]                       = useState('');

  // Adicionar Compra
  const [compraForm, setCompraForm]       = useState(emptyCompra);
  const [compraSearch, setCompraSearch]   = useState('');
  const [compraOpen, setCompraOpen]       = useState(false);
  const [savingCompra, setSavingCompra]   = useState(false);
  const [msgCompra, setMsgCompra]         = useState('');

  // Resgate de Pontos
  const [resgateForm, setResgateForm]     = useState(emptyResgate);
  const [resgateSearch, setResgateSearch] = useState('');
  const [resgateOpen, setResgateOpen]     = useState(false);
  const [savingResgate, setSavingResgate] = useState(false);
  const [msgResgate, setMsgResgate]       = useState('');

  // Adicionar Bônus
  const [bonusForm, setBonusForm]         = useState(emptyBonus);
  const [bonusSearch, setBonusSearch]     = useState('');
  const [bonusOpen, setBonusOpen]         = useState(false);
  const [savingBonus, setSavingBonus]     = useState(false);
  const [msgBonus, setMsgBonus]           = useState('');

  useEffect(() => {
    getDashboardStats().then(setStats);
    getClientes().then(setClientes);
    getCampanhas().then(setCampanhas);
  }, []);

  // ── Novo Cliente ──────────────────────────────────────────────────────────
  const handleClienteSubmit = async e => {
    e.preventDefault();
    setSavingC(true);
    await createCliente({
      nome_completo: clienteForm.nome_completo,
      cpf:      Number(clienteForm.cpf),
      email:    clienteForm.email || null,
      whatsapp: Number(clienteForm.whatsapp),
      cep:      clienteForm.cep ? Number(clienteForm.cep) : null,
    });
    const [updatedStats, updatedClientes] = await Promise.all([getDashboardStats(), getClientes()]);
    setStats(updatedStats);
    setClientes(updatedClientes);
    setClienteForm(emptyCliente);
    setCpfDisplay('');
    setWhatsappDisplay('');
    setMsgC('Cliente cadastrado com sucesso!');
    setSavingC(false);
    setTimeout(() => setMsgC(''), 3000);
  };

  // ── Adicionar Compra ──────────────────────────────────────────────────────
  const handleCompraSubmit = async e => {
    e.preventDefault();
    setSavingCompra(true);
    const total_compra = parseFloat(String(compraForm.total_compra).replace(',', '.'));
    const campanha = campanhas.find(c => c.Id === Number(compraForm.campanha_id));
    const pontos_campanha = campanha?.pontos ?? 0;
    const pontos = Math.trunc(total_compra)*pontos_campanha;
    await createTransacao({
      id_cliente:  compraForm.id_cliente,
      tipo:        'Compra',
      pontos,
      total_compra,
      detalhes:    compraForm.detalhes || null,
    });
    const updated = await getDashboardStats();
    setStats(updated);
    setCompraForm(emptyCompra);
    setCompraSearch('');
    setMsgCompra('Compra registrada com sucesso!');
    setSavingCompra(false);
    setTimeout(() => setMsgCompra(''), 3000);
  };

  // ── Resgate de Pontos ─────────────────────────────────────────────────────
  const handleResgateSubmit = async e => {
    e.preventDefault();
    setSavingResgate(true);
    await createTransacao({
      id_cliente:  resgateForm.id_cliente,
      tipo:        'Resgate',
      pontos:      Number(resgateForm.pontos),
      total_compra: 0,
      detalhes:    resgateForm.detalhes || null,
    });
    const updated = await getDashboardStats();
    setStats(updated);
    setResgateForm(emptyResgate);
    setResgateSearch('');
    setMsgResgate('Resgate registrado com sucesso!');
    setSavingResgate(false);
    setTimeout(() => setMsgResgate(''), 3000);
  };

  // ── Adicionar Bônus ───────────────────────────────────────────────────────
  const handleBonusSubmit = async e => {
    e.preventDefault();
    setSavingBonus(true);
    await createTransacao({
      id_cliente:  bonusForm.id_cliente,
      tipo:        'Bônus',
      pontos:      Number(bonusForm.pontos),
      total_compra: 0,
      detalhes:    bonusForm.detalhes || null,
    });
    const updated = await getDashboardStats();
    setStats(updated);
    setBonusForm(emptyBonus);
    setBonusSearch('');
    setMsgBonus('Bônus registrado com sucesso!');
    setSavingBonus(false);
    setTimeout(() => setMsgBonus(''), 3000);
  };

  return (
    <div className="page">

      {/* 2×2 Forms grid: col1 = Novo Cliente / Resgate | col2 = Compra / Bônus */}
      <div className="forms-grid">

        {/* Row 1, Col 1 — Novo Cliente */}
        <div className="card">
          <h2 className="card-title">Novo Cliente</h2>
          <form onSubmit={handleClienteSubmit} className="form">
            <div className="form-row">
              <label>Nome Completo *</label>
              <input required value={clienteForm.nome_completo} onChange={e => setClienteForm({ ...clienteForm, nome_completo: e.target.value })} placeholder="Nome completo" />
            </div>
            <div className="form-row">
              <label>CPF *</label>
              <input
                required type="text" inputMode="numeric"
                value={cpfDisplay}
                onChange={e => {
                  const masked = maskCpf(e.target.value);
                  setCpfDisplay(masked);
                  setClienteForm({ ...clienteForm, cpf: masked.replace(/\D/g, '') });
                }}
                placeholder="000.000.000-00" maxLength={14}
              />
            </div>
            <div className="form-row">
              <label>WhatsApp *</label>
              <input
                required type="text" inputMode="numeric"
                value={whatsappDisplay}
                onChange={e => {
                  const masked = maskWhatsapp(e.target.value);
                  setWhatsappDisplay(masked);
                  setClienteForm({ ...clienteForm, whatsapp: masked.replace(/\D/g, '') });
                }}
                placeholder="(00) 00000-0000" maxLength={15}
              />
            </div>
            <div className="form-row">
              <label>E-mail</label>
              <input type="email" value={clienteForm.email} onChange={e => setClienteForm({ ...clienteForm, email: e.target.value })} placeholder="email@exemplo.com" />
            </div>
            <div className="form-row">
              <label>CEP</label>
              <input type="number" value={clienteForm.cep} onChange={e => setClienteForm({ ...clienteForm, cep: e.target.value })} placeholder="Somente números" />
            </div>
            {msgC && <p className="form-success">{msgC}</p>}
            <button className="btn btn-primary" type="submit" disabled={savingC}>
              {savingC ? 'Salvando…' : 'Cadastrar Cliente'}
            </button>
          </form>
        </div>

        {/* Row 1, Col 2 — Adicionar Compra */}
        <div className="card">
          <h2 className="card-title">Adicionar Compra</h2>
          <form onSubmit={handleCompraSubmit} className="form">
            <div className="form-row">
              <label>Cliente *</label>
              <ClienteSearch
                clientes={clientes}
                value={compraForm.id_cliente}
                search={compraSearch}
                open={compraOpen}
                onSearchChange={text => { setCompraSearch(text); setCompraForm({ ...compraForm, id_cliente: '' }); setCompraOpen(true); }}
                onSelect={c => { setCompraForm({ ...compraForm, id_cliente: c.id }); setCompraSearch(c.nome_completo); setCompraOpen(false); }}
                onFocus={() => setCompraOpen(true)}
                onBlur={() => setTimeout(() => setCompraOpen(false), 150)}
              />
            </div>
            <div className="form-row">
              <label>Campanha</label>
              <select value={compraForm.campanha_id} onChange={e => setCompraForm({ ...compraForm, campanha_id: e.target.value })}>
                <option value="">Nenhuma</option>
                {campanhas.map(c => <option key={c.Id} value={c.Id}>{c.nome}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Total da Compra (R$) *</label>
              <input required type="number" step="0.01" min="0" value={compraForm.total_compra} onChange={e => setCompraForm({ ...compraForm, total_compra: e.target.value })} placeholder="0,00" />
            </div>
            <div className="form-row">
              <label>Detalhes</label>
              <input value={compraForm.detalhes} onChange={e => setCompraForm({ ...compraForm, detalhes: e.target.value })} placeholder="Detalhes opcionais" />
            </div>
            {msgCompra && <p className="form-success">{msgCompra}</p>}
            <button className="btn btn-primary" type="submit" disabled={savingCompra}>
              {savingCompra ? 'Salvando…' : 'Registrar Compra'}
            </button>
          </form>
        </div>

        {/* Row 2, Col 1 — Resgate de Pontos */}
        <div className="card">
          <h2 className="card-title">Resgate de Pontos</h2>
          <form onSubmit={handleResgateSubmit} className="form">
            <div className="form-row">
              <label>Cliente *</label>
              <ClienteSearch
                clientes={clientes}
                value={resgateForm.id_cliente}
                search={resgateSearch}
                open={resgateOpen}
                onSearchChange={text => { setResgateSearch(text); setResgateForm({ ...resgateForm, id_cliente: '' }); setResgateOpen(true); }}
                onSelect={c => { setResgateForm({ ...resgateForm, id_cliente: c.id }); setResgateSearch(c.nome_completo); setResgateOpen(false); }}
                onFocus={() => setResgateOpen(true)}
                onBlur={() => setTimeout(() => setResgateOpen(false), 150)}
              />
            </div>
            <div className="form-row">
              <label>Pontos *</label>
              <input required type="number" min="1" value={resgateForm.pontos} onChange={e => setResgateForm({ ...resgateForm, pontos: e.target.value })} placeholder="0" />
            </div>
            <div className="form-row">
              <label>Detalhes</label>
              <input value={resgateForm.detalhes} onChange={e => setResgateForm({ ...resgateForm, detalhes: e.target.value })} placeholder="Detalhes opcionais" />
            </div>
            {msgResgate && <p className="form-success">{msgResgate}</p>}
            <button className="btn btn-primary" type="submit" disabled={savingResgate}>
              {savingResgate ? 'Salvando…' : 'Registrar Resgate'}
            </button>
          </form>
        </div>

        {/* Row 2, Col 2 — Adicionar Bônus */}
        <div className="card">
          <h2 className="card-title">Adicionar Bônus</h2>
          <form onSubmit={handleBonusSubmit} className="form">
            <div className="form-row">
              <label>Cliente *</label>
              <ClienteSearch
                clientes={clientes}
                value={bonusForm.id_cliente}
                search={bonusSearch}
                open={bonusOpen}
                onSearchChange={text => { setBonusSearch(text); setBonusForm({ ...bonusForm, id_cliente: '' }); setBonusOpen(true); }}
                onSelect={c => { setBonusForm({ ...bonusForm, id_cliente: c.id }); setBonusSearch(c.nome_completo); setBonusOpen(false); }}
                onFocus={() => setBonusOpen(true)}
                onBlur={() => setTimeout(() => setBonusOpen(false), 150)}
              />
            </div>
            <div className="form-row">
              <label>Pontos *</label>
              <input required type="number" min="1" value={bonusForm.pontos} onChange={e => setBonusForm({ ...bonusForm, pontos: e.target.value })} placeholder="0" />
            </div>
            <div className="form-row">
              <label>Detalhes</label>
              <input value={bonusForm.detalhes} onChange={e => setBonusForm({ ...bonusForm, detalhes: e.target.value })} placeholder="Detalhes opcionais" />
            </div>
            {msgBonus && <p className="form-success">{msgBonus}</p>}
            <button className="btn btn-primary" type="submit" disabled={savingBonus}>
              {savingBonus ? 'Salvando…' : 'Registrar Bônus'}
            </button>
          </form>
        </div>

      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard label="Clientes Ativos" value={stats?.totalClientes ?? '…'} color="#5C1B09" />
        <StatCard label="Pontos em Compras (30 dias)" value={stats?.pontosCompra30Dias ?? '…'} color="#BBA069" />
        <StatCard label="Pontos Resgatados" value={stats?.pontosResgate ?? '…'} color="#5C1B09" />
      </div>

      {/* Top 10 table */}
      <div className="card">
        <h2 className="card-title">Top 10 Clientes por Pontos em Compras</h2>
        <table className="table">
          <thead>
            <tr><th>#</th><th>Cliente</th><th>Total de Pontos</th></tr>
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
    </div>
  );
}

function ClienteSearch({ clientes, value, search, open, onSearchChange, onSelect, onFocus, onBlur }) {
  const filtered = clientes.filter(c =>
    c.nome_completo.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Digite para buscar…"
        autoComplete="off"
        required={!value}
        style={{ width: '100%' }}
      />
      {open && filtered.length > 0 && (
        <ul className="cliente-search-dropdown">
          {filtered.map(c => (
            <li key={c.id} onMouseDown={() => onSelect(c)} className="cliente-search-option">
              {c.nome_completo}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="stat-card" style={{ '--accent': color }}>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
