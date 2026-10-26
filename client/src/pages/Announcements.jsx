import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import api, { errMsg, fmtDate } from '../api';

export default function Announcements() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [f, setF] = useState({ title: '', message: '', type: 'announcement' });
  const [err, setErr] = useState('');

  const load = () => api.get('/announcements').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const post = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.post('/announcements', f); setF({ title: '', message: '', type: 'announcement' }); load(); }
    catch (x) { setErr(errMsg(x)); }
  };
  const del = async (id) => { if (confirm('Delete?')) { await api.delete(`/announcements/${id}`); load(); } };

  return (
    <>
      <h4 className="mb-3">Announcements & News</h4>
      {user.role === 'hr' && (
        <form className="card p-3 mb-4" onSubmit={post}>
          {err && <div className="alert alert-danger py-2">{err}</div>}
          <div className="row g-2">
            <div className="col-md-5"><input className="form-control" placeholder="Title" value={f.title} onChange={set('title')} required /></div>
            <div className="col-md-3">
              <select className="form-select" value={f.type} onChange={set('type')}>
                <option value="announcement">Announcement</option><option value="news">News</option>
              </select>
            </div>
            <div className="col-12"><textarea className="form-control" rows="3" placeholder="Message" value={f.message} onChange={set('message')} required /></div>
          </div>
          <button className="btn btn-primary mt-3 align-self-start">Post</button>
        </form>
      )}
      {list.map((a) => (
        <div className="card p-3 mb-3" key={a._id}>
          <div className="d-flex justify-content-between">
            <h5>{a.title} <span className="badge bg-secondary">{a.type}</span></h5>
            {user.role === 'hr' && <button className="btn btn-sm btn-outline-danger" onClick={() => del(a._id)}>Delete</button>}
          </div>
          <p className="mb-1">{a.message}</p>
          <small className="text-muted">By {a.postedBy?.name || 'HR'} on {fmtDate(a.createdAt)}</small>
        </div>
      ))}
      {list.length === 0 && <p className="text-muted">No posts yet.</p>}
    </>
  );
}
