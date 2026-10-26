import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import api, { errMsg } from '../api';

const empty = { name: '', email: '', password: '', role: 'employee', department: '', position: '', phone: '', salary: 0, manager: '' };

export default function Employees() {
  const { user } = useAuth();
  const isHR = user.role === 'hr';
  const [list, setList] = useState([]);
  const [form, setForm] = useState(null); // null = hidden
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState('');

  const load = () => api.get('/users').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const managers = list.filter((u) => u.role === 'manager');

  const edit = (u) => {
    setEditId(u._id);
    setForm({ ...empty, ...u, password: '', manager: u.manager?._id || '' });
  };

  const save = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (editId) await api.put(`/users/${editId}`, form);
      else await api.post('/users', form);
      setForm(null); setEditId(null); load();
    } catch (x) { setErr(errMsg(x)); }
  };

  const del = async (id) => {
    if (!confirm('Delete this employee?')) return;
    try { await api.delete(`/users/${id}`); load(); } catch (x) { alert(errMsg(x)); }
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h4>{isHR ? 'Employees' : 'My Team'}</h4>
        {isHR && <button className="btn btn-primary" onClick={() => { setEditId(null); setForm(empty); }}>+ Add Employee</button>}
      </div>

      {form && (
        <form className="card p-3 mb-3" onSubmit={save}>
          {err && <div className="alert alert-danger py-2">{err}</div>}
          <div className="row g-2">
            <div className="col-md-4"><input className="form-control" placeholder="Name" value={form.name} onChange={set('name')} required /></div>
            <div className="col-md-4"><input type="email" className="form-control" placeholder="Email" value={form.email} onChange={set('email')} required /></div>
            <div className="col-md-4"><input type="password" className="form-control" placeholder={editId ? 'New password (optional)' : 'Password'} minLength={6} value={form.password} onChange={set('password')} required={!editId} /></div>
            <div className="col-md-3">
              <select className="form-select" value={form.role} onChange={set('role')}>
                <option value="employee">Employee</option><option value="manager">Manager</option><option value="hr">HR</option>
              </select>
            </div>
            <div className="col-md-3"><input className="form-control" placeholder="Department" value={form.department} onChange={set('department')} /></div>
            <div className="col-md-3"><input className="form-control" placeholder="Position" value={form.position} onChange={set('position')} /></div>
            <div className="col-md-3"><input className="form-control" placeholder="Phone" value={form.phone} onChange={set('phone')} /></div>
            <div className="col-md-3"><input type="number" className="form-control" placeholder="Salary" value={form.salary} onChange={set('salary')} /></div>
            <div className="col-md-3">
              <select className="form-select" value={form.manager} onChange={set('manager')}>
                <option value="">No manager</option>
                {managers.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-success me-2">{editId ? 'Update' : 'Create'}</button>
            <button type="button" className="btn btn-secondary" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card table-responsive">
        <table className="table table-hover mb-0">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Dept</th><th>Position</th><th>Manager</th>{isHR && <th></th>}</tr></thead>
          <tbody>
            {list.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td><td>{u.email}</td><td className="text-capitalize">{u.role}</td>
                <td>{u.department}</td><td>{u.position}</td><td>{u.manager?.name || '-'}</td>
                {isHR && (
                  <td className="text-nowrap">
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => edit(u)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => del(u._id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan="7" className="text-center text-muted">No records</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
