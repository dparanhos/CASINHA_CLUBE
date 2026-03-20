import { useEffect, useState } from 'react';
import { getCampanhas, createCampanha, updateCampanha, deleteCampanha } from '../../services/api';
import './CampanhasPage.css';

const emptyRow = { nome: '', pontos: '', descricao: '' };

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

  const startEdit = c => { setEditingId(c.Id); setEditForm({ nome: c.nome, pontos: c.pontos, descricao: c.descricao || '' }); };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = async () => {
    setSaving(true);
    await updateCampanha(editingId, { nome: editForm.nome, pontos: Number(editForm.pontos), descricao: editForm.descricao || null });
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
    if (!newRow.nome || newRow.pontos === '') return;
    setSaving(true);
    await createCampanha({ nome: newRow.nome, pontos: Number(newRow.pontos), descricao: newRow.descricao || null });
    await load();
    setNewRow(emptyRow);
    setAdding(false);
    setSaving(false);
  };

  const textField = (key, form, setForm) => (
    <input
      value={form[key] ?? ''}
      onChange={e => setForm({ ...form, [key]: e.target.value })}
      className="cell-input"
    />
  );

  const numberField = (key, form, setForm) => (
    <input
      type="number"
      value={form[key] ?? ''}
      onChange={e => setForm({ ...form, [key]: e.target.value })}
      className="cell-input"
      min="0"
    />
  );

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
              <th>Pontos</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {campanhas.map(c => (
              <tr key={c.Id} className={editingId === c.Id ? 'editing-row' : ''}>
                {editingId === c.Id ? (
                  <>
                    <td>{textField('nome', editForm, setEditForm)}</td>
                    <td>{numberField('pontos', editForm, setEditForm)}</td>
                    <td>{textField('descricao', editForm, setEditForm)}</td>
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
                    <td>{c.pontos}</td>
                    <td className="desc-cell">{c.descricao || '—'}</td>
                    <td className="actions">
                      <button className="btn btn-sm btn-outline" onClick={() => startEdit(c)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.Id)} disabled={deleting === c.Id}>
                        {deleting === c.Id ? '…' : 'Remover'}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}

            {adding && (
              <tr className="editing-row new-row">
                <td>{textField('nome', newRow, setNewRow)}</td>
                <td>{numberField('pontos', newRow, setNewRow)}</td>
                <td>{textField('descricao', newRow, setNewRow)}</td>
                <td className="actions">
                  <button className="btn btn-sm btn-primary" onClick={saveNew} disabled={saving || !newRow.nome || newRow.pontos === ''}>
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
