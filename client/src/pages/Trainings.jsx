import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import api, { errMsg, fmtDate } from '../api';

const empty = { title: '', description: '', trainer: '', startDate: '', endDate: '', participants: [] };

export default function Trainings() {
  const { user } = useAuth();
  const canManage = user.role !== 'employee';
  const [list, setList] = useState([]);
  const [people, setPeople] = useState([]);
  const [f, setF] = useState(empty);
  const [err, setErr] = useState('');

  const load = () => api.get('/trainings').then((r) => setList(r.data));
  useEffect(() => {
    load();
    if (canManage) api.get('/users').then((r) => setPeople(r.data.filter((u) => u.role === 'employee')));
  }, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggle = (id) =>
    setF({ ...f, participants: f.participants.includes(id) ? f.participants.filter((p) => p !== id) : [...f.participants, id] });

  const create = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.post('/trainings', f); setF(empty); load(); }
    catch (x) { setErr(errMsg(x)); }
  };
  const del = async (id) => {
    if (!confirm('Delete program?')) return;
    try { await api.delete(`/trainings/${id}`); load(); } catch (x) { alert(errMsg(x)); }
  };

  return (
    <>
      <h4 className="mb-3">Training & Development</h4>
      {canManage && (
        <form className="card p-3 mb-4" onSubmit={create}>
          {err && <div className="alert alert-danger py-2">{err}</div>}
          <div className="row g-2">
            <div className="col-md-4"><input className="form-control" placeholder="Program title" value={f.title} onChange={set('title')} required /></div>
            <div className="col-md-3"><input className="form-control" placeholder="Trainer" value={f.trainer} onChange={set('trainer')} /></div>
            <div className="col-md-2"><input type="date" className="form-control" value={f.startDate} onChange={set('startDate')} required /></div>
            <div className="col-md-2"><input type="date" className="form-control" value={f.endDate} onChange={set('endDate')} required /></div>
            <div className="col-12"><input className="form-control" placeholder="Description" value={f.description} onChange={set('description')} /></div>
            <div className="col-12">
              <small className="text-muted d-block mb-1">Participants</small>
              {people.map((p) => (
                <label key={p._id} className="me-3">
                  <input type="checkbox" className="form-check-input me-1" checked={f.participants.includes(p._id)} onChange={() => toggle(p._id)} />
                  {p.name}
                </label>
              ))}
              {people.length === 0 && <span className="text-muted">No employees available</span>}
            </div>
          </div>
          <button className="btn btn-primary mt-3 align-self-start">Create Program</button>
        </form>
      )}

      <div className="row g-3">
        {list.map((t) => (
          <div className="col-md-6" key={t._id}>
            <div className="card p-3 h-100">
              <div className="d-flex justify-content-between">
                <h5>{t.title}</h5>
                {canManage && <button className="btn btn-sm btn-outline-danger" onClick={() => del(t._id)}>Delete</button>}
              </div>
              <div className="text-muted mb-1">{fmtDate(t.startDate)} - {fmtDate(t.endDate)} {t.trainer && `| Trainer: ${t.trainer}`}</div>
              <p className="mb-1">{t.description}</p>
              <small>Participants: {t.participants.map((p) => p.name).join(', ') || 'none'}</small>
            </div>
          </div>
        ))}
      </div>
      {list.length === 0 && <p className="text-muted">No training programs.</p>}
    </>
  );
}
