import { useEffect, useState } from 'react';
import { getClientes, createCliente, updateCliente, deleteCliente } from '../../services/api';
import Modal from '../../components/Modal';
import './ClientesPage.css';

const emptyForm = { nome: '', email: '', telefone: '', cpf: '', data_nascimento: '', ativo: true };

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
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.cpf.includes(search)
  );

  const openNew = () => { setForm(emptyForm); setModal('new'); };
  const openEdit = c => { setForm({ ...c }); setModal(c); };
  const closeModal = () => setModal(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    if (modal === 'new') {
      await createCliente(form);
    } else {
      await updateCliente(modal.id, form);
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
              <th>Telefone</th>
              <th>CPF</th>
              <th>Cadastro</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="empty">Nenhum cliente encontrado.</td></tr>
            )}
            {filtered.map(c => (
              <tr key={c.id}>
                <td><strong>{c.nome}</strong></td>
                <td>{c.email}</td>
                <td>{c.telefone}</td>
                <td>{c.cpf}</td>
                <td>{c.data_cadastro}</td>
                <td>
                  <span className={`badge ${c.ativo ? 'badge-green' : 'badge-gray'}`}>
                    {c.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
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
              <label>Nome *</label>
              <input required value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div className="form-row">
              <label>E-mail</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Telefone</label>
              <input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
            </div>
            <div className="form-row">
              <label>CPF</label>
              <input value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Data de Nascimento</label>
              <input type="date" value={form.data_nascimento} onChange={e => setForm({ ...form, data_nascimento: e.target.value })} />
            </div>
            <div className="form-row form-row-check">
              <label>
                <input type="checkbox" checked={form.ativo} onChange={e => setForm({ ...form, ativo: e.target.checked })} />
                Cliente ativo
              </label>
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
