import { useState } from 'react';
import { useAuth } from '../AuthContext';
import api, { errMsg, fmtDate } from '../api';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [f, setF] = useState({ name: user.name, phone: user.phone || '', address: user.address || '', password: '' });
  const [msg, setMsg] = useState({ ok: true, text: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/users/me/profile', f);
      setUser(data);
      setF({ ...f, password: '' });
      setMsg({ ok: true, text: 'Profile updated' });
    } catch (x) { setMsg({ ok: false, text: errMsg(x) }); }
  };

  return (
    <div className="row g-3">
      <div className="col-md-4">
        <div className="card p-3">
          <h5>{user.name}</h5>
          <div className="text-muted text-capitalize">{user.role}</div>
          <hr />
          <div>Email: {user.email}</div>
          <div>Department: {user.department || '-'}</div>
          <div>Position: {user.position || '-'}</div>
          <div>Joined: {fmtDate(user.joinDate)}</div>
        </div>
      </div>
      <div className="col-md-8">
        <form className="card p-3" onSubmit={save}>
          <h5>Edit Personal Record</h5>
          {msg.text && <div className={`alert alert-${msg.ok ? 'success' : 'danger'} py-2`}>{msg.text}</div>}
          <input className="form-control mb-2" placeholder="Name" value={f.name} onChange={set('name')} required />
          <input className="form-control mb-2" placeholder="Phone" value={f.phone} onChange={set('phone')} />
          <textarea className="form-control mb-2" rows="2" placeholder="Address" value={f.address} onChange={set('address')} />
          <input type="password" className="form-control mb-3" placeholder="New password (optional)" minLength={6} value={f.password} onChange={set('password')} />
          <button className="btn btn-primary align-self-start">Save</button>
        </form>
      </div>
    </div>
  );
}
