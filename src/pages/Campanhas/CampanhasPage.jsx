import { useEffect, useState } from 'react';
import { getCampanhas, createCampanha, updateCampanha, deleteCampanha } from '../../services/api';
import './CampanhasPage.css';

const emptyRow = { nome: '', descricao: '', data_inicio: '', data_fim: '', tipo: 'Desconto', valor_beneficio: '', status: 'Ativa' };

export default function CampanhasPage() {
  const [campanhas, setCampanhas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState(emptyRow);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = () => getCampanhas().then(setCampanhas);
  useEffect(() => { load(); }, []);

  const startEdit = c => { setEditingId(c.id); setEditForm({ ...c }); };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = async () => {
    setSaving(true);
    await updateCampanha(editingId, editForm);
    await load();
    setEditingId(null);
    setSaving(false);
  };

  const handleDelete = async id => {
    if (!window.confirm('Remover esta campanha?')) return;
    setDeleting(id);
    await deleteCampanha(id);
    await load();
    setDeleting(null);
  };

  const saveNew = async () => {
    if (!newRow.nome) return;
    setSaving(true);
    await createCampanha({ ...newRow, valor_beneficio: parseFloat(newRow.valor_beneficio) || 0 });
    await load();
    setNewRow(emptyRow);
    setAdding(false);
    setSaving(false);
  };

  const field = (key, form, setForm, type = 'text', opts) => {
    if (type === 'select') {
      return (
        <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="cell-input">
          {opts.map(o => <option key={o}>{o}</option>)}
        </select>
      );
    }
    return (
      <input
        type={type}
        value={form[key] ?? ''}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        className="cell-input"
        step={type === 'number' ? '0.01' : undefined}
      />
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Campanhas</h1>
        <button className="btn btn-primary" onClick={() => setAdding(true)} disabled={adding}>+ Nova Campanha</button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="table camp-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Tipo</th>
              <th>Benefício</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {campanhas.map(c => (
              <tr key={c.id} className={editingId === c.id ? 'editing-row' : ''}>
                {editingId === c.id ? (
                  <>
                    <td>{field('nome', editForm, setEditForm)}</td>
                    <td>{field('descricao', editForm, setEditForm)}</td>
                    <td>{field('data_inicio', editForm, setEditForm, 'date')}</td>
                    <td>{field('data_fim', editForm, setEditForm, 'date')}</td>
                    <td>{field('tipo', editForm, setEditForm, 'select', ['Desconto', 'Cashback', 'Pontos'])}</td>
                    <td>{field('valor_beneficio', editForm, setEditForm, 'number')}</td>
                    <td>{field('status', editForm, setEditForm, 'select', ['Ativa', 'Inativa', 'Encerrada', 'Agendada'])}</td>
                    <td className="actions">
                      <button className="btn btn-sm btn-primary" onClick={saveEdit} disabled={saving}>
                        {saving ? '…' : 'Salvar'}
                      </button>
                      <button className="btn btn-sm btn-outline" onClick={cancelEdit}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td><strong>{c.nome}</strong></td>
                    <td className="desc-cell">{c.descricao}</td>
                    <td>{c.data_inicio}</td>
                    <td>{c.data_fim}</td>
                    <td><span className={`badge badge-tipo-${c.tipo.toLowerCase()}`}>{c.tipo}</span></td>
                    <td>{c.valor_beneficio}{c.tipo === 'Pontos' ? 'x' : '%'}</td>
                    <td><span className={`badge ${statusBadge(c.status)}`}>{c.status}</span></td>
                    <td className="actions">
                      <button className="btn btn-sm btn-outline" onClick={() => startEdit(c)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)} disabled={deleting === c.id}>
                        {deleting === c.id ? '…' : 'Remover'}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}

            {/* New row */}
            {adding && (
              <tr className="editing-row new-row">
                <td>{field('nome', newRow, setNewRow)}</td>
                <td>{field('descricao', newRow, setNewRow)}</td>
                <td>{field('data_inicio', newRow, setNewRow, 'date')}</td>
                <td>{field('data_fim', newRow, setNewRow, 'date')}</td>
                <td>{field('tipo', newRow, setNewRow, 'select', ['Desconto', 'Cashback', 'Pontos'])}</td>
                <td>{field('valor_beneficio', newRow, setNewRow, 'number')}</td>
                <td>{field('status', newRow, setNewRow, 'select', ['Ativa', 'Inativa', 'Encerrada', 'Agendada'])}</td>
                <td className="actions">
                  <button className="btn btn-sm btn-primary" onClick={saveNew} disabled={saving || !newRow.nome}>
                    {saving ? '…' : 'Salvar'}
                  </button>
                  <button className="btn btn-sm btn-outline" onClick={() => { setAdding(false); setNewRow(emptyRow); }}>Cancelar</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="table-count">{campanhas.length} registro(s)</p>
      </div>
    </div>
  );
}

function statusBadge(status) {
  const map = { Ativa: 'badge-green', Inativa: 'badge-gray', Encerrada: 'badge-red', Agendada: 'badge-yellow' };
  return map[status] || 'badge-gray';
}
