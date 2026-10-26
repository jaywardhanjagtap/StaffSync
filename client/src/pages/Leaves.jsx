import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import api, { errMsg, fmtDate } from '../api';

const badge = { pending: 'warning', approved: 'success', rejected: 'danger' };

export default function Leaves() {
  const { user } = useAuth();
  const canReview = user.role !== 'employee';
  const [mine, setMine] = useState([]);
  const [all, setAll] = useState([]);
  const [f, setF] = useState({ type: 'casual', startDate: '', endDate: '', reason: '' });
  const [err, setErr] = useState('');

  const load = () => {
    api.get('/leaves/mine').then((r) => setMine(r.data));
    if (canReview) api.get('/leaves').then((r) => setAll(r.data));
  };
  useEffect(load, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const apply = async (e) => {
    e.preventDefault(); setErr('');
    try {
      await api.post('/leaves', f);
      setF({ type: 'casual', startDate: '', endDate: '', reason: '' });
      load();
    } catch (x) { setErr(errMsg(x)); }
  };

  const review = async (id, status) => {
    const comment = status === 'rejected' ? prompt('Reason for rejection (optional)') || '' : '';
    try { await api.put(`/leaves/${id}/status`, { status, comment }); load(); }
    catch (x) { alert(errMsg(x)); }
  };

  return (
    <>
      <h4>Apply for Leave</h4>
      <form className="card p-3 mb-4" onSubmit={apply}>
        {err && <div className="alert alert-danger py-2">{err}</div>}
        <div className="row g-2">
          <div className="col-md-2">
            <select className="form-select" value={f.type} onChange={set('type')}>
              <option value="casual">Casual</option><option value="sick">Sick</option>
              <option value="annual">Annual</option><option value="unpaid">Unpaid</option>
            </select>
          </div>
          <div className="col-md-2"><input type="date" className="form-control" value={f.startDate} onChange={set('startDate')} required /></div>
          <div className="col-md-2"><input type="date" className="form-control" value={f.endDate} onChange={set('endDate')} required /></div>
          <div className="col-md-4"><input className="form-control" placeholder="Reason" value={f.reason} onChange={set('reason')} /></div>
          <div className="col-md-2"><button className="btn btn-primary w-100">Apply</button></div>
        </div>
      </form>

      <h5>My Leaves</h5>
      <div className="card table-responsive mb-4">
        <table className="table mb-0">
          <thead><tr><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Comment</th></tr></thead>
          <tbody>
            {mine.map((l) => (
              <tr key={l._id}>
                <td className="text-capitalize">{l.type}</td><td>{fmtDate(l.startDate)}</td><td>{fmtDate(l.endDate)}</td>
                <td>{l.reason}</td><td><span className={`badge bg-${badge[l.status]}`}>{l.status}</span></td><td>{l.comment}</td>
              </tr>
            ))}
            {mine.length === 0 && <tr><td colSpan="6" className="text-center text-muted">No leaves yet</td></tr>}
          </tbody>
        </table>
      </div>

      {canReview && (
        <>
          <h5>{user.role === 'hr' ? 'All Leave Requests' : 'Team Leave Requests'}</h5>
          <div className="card table-responsive">
            <table className="table mb-0">
              <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {all.map((l) => (
                  <tr key={l._id}>
                    <td>{l.employee?.name}</td><td className="text-capitalize">{l.type}</td>
                    <td>{fmtDate(l.startDate)}</td><td>{fmtDate(l.endDate)}</td><td>{l.reason}</td>
                    <td><span className={`badge bg-${badge[l.status]}`}>{l.status}</span></td>
                    <td className="text-nowrap">
                      {l.status === 'pending' && l.employee?._id !== user._id && (
                        <>
                          <button className="btn btn-sm btn-success me-1" onClick={() => review(l._id, 'approved')}>Approve</button>
                          <button className="btn btn-sm btn-danger" onClick={() => review(l._id, 'rejected')}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {all.length === 0 && <tr><td colSpan="7" className="text-center text-muted">No requests</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
