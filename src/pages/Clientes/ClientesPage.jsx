import { useEffect, useState } from 'react';
import { getClientes, createCliente, updateCliente, deleteCliente } from '../../services/api';
import Modal from '../../components/Modal';
import './ClientesPage.css';

const emptyForm = { nome_completo: '', cpf: '', email: '', whatsapp: '', cep: '' };

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // 'new' | { ...cliente }
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = () => getClientes().then(setClientes);
  useEffect(() => { load(); }, []);

  const filtered = clientes.filter(c =>
    c.nome_completo?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    String(c.cpf).includes(search)
  );

  const openNew = () => { setForm(emptyForm); setModal('new'); };
  const openEdit = c => {
    setForm({
      nome_completo: c.nome_completo || '',
      cpf: c.cpf || '',
      email: c.email || '',
      whatsapp: c.whatsapp || '',
      cep: c.cep || '',
    });
    setModal(c);
  };
  const closeModal = () => setModal(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      nome_completo: form.nome_completo,
      cpf: Number(form.cpf),
      email: form.email || null,
      whatsapp: Number(form.whatsapp),
      cep: form.cep ? Number(form.cep) : null,
    };
    if (modal === 'new') {
      await createCliente(payload);
    } else {
      await updateCliente(modal.id, payload);
    }
    await load();
    closeModal();
    setSaving(false);
  };

  const handleDelete = async id => {
    if (!window.confirm('Remover este cliente?')) return;
    setDeleting(id);
    await deleteCliente(id);
    await load();
    setDeleting(null);
  };

  const formatDate = iso => iso ? new Date(iso).toLocaleDateString('pt-BR') : '—';

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <button className="btn btn-primary" onClick={openNew}>+ Novo Cliente</button>
      </div>

      <div className="card">
        <input
          className="search-bar"
          placeholder="Buscar por nome, e-mail ou CPF…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>WhatsApp</th>
              <th>CPF</th>
              <th>Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="empty">Nenhum cliente encontrado.</td></tr>
            )}
            {filtered.map(c => (
              <tr key={c.id}>
                <td><strong>{c.nome_completo}</strong></td>
                <td>{c.email || '—'}</td>
                <td>{c.whatsapp || '—'}</td>
                <td>{c.cpf}</td>
                <td>{formatDate(c.data_entrada)}</td>
                <td className="actions">
                  <button className="btn btn-sm btn-outline" onClick={() => openEdit(c)}>Editar</button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(c.id)}
                    disabled={deleting === c.id}
                  >
                    {deleting === c.id ? '…' : 'Remover'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="table-count">{filtered.length} registro(s)</p>
      </div>

      {modal && (
        <Modal title={modal === 'new' ? 'Novo Cliente' : 'Editar Cliente'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-row">
              <label>Nome Completo *</label>
              <input required value={form.nome_completo} onChange={e => setForm({ ...form, nome_completo: e.target.value })} />
            </div>
            <div className="form-row">
              <label>CPF *</label>
              <input required type="number" value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} placeholder="Somente números" />
            </div>
            <div className="form-row">
              <label>WhatsApp *</label>
              <input required type="number" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="(11) 99999-9999" />
            </div>
            <div className="form-row">
              <label>E-mail</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-row">
              <label>CEP</label>
              <input type="number" value={form.cep} onChange={e => setForm({ ...form, cep: e.target.value })} placeholder="Somente números" />
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
