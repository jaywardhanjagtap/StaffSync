import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import api, { errMsg, fmtTime } from '../api';

export default function Attendance() {
  const { user } = useAuth();
  const [mine, setMine] = useState([]);
  const [all, setAll] = useState([]);
  const [date, setDate] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => {
    api.get('/attendance/mine').then((r) => setMine(r.data));
    if (user.role !== 'employee') api.get('/attendance', { params: date ? { date } : {} }).then((r) => setAll(r.data));
  };
  useEffect(load, [date]);

  const act = async (what) => {
    setMsg('');
    try { await api.post(`/attendance/${what}`); load(); }
    catch (x) { setMsg(errMsg(x)); }
  };

  const Row = ({ r, showName }) => (
    <tr>
      {showName && <td>{r.employee?.name}</td>}
      <td>{r.date}</td><td>{fmtTime(r.checkIn)}</td><td>{fmtTime(r.checkOut)}</td>
      <td><span className={`badge bg-${r.status === 'present' ? 'success' : 'warning'}`}>{r.status}</span></td>
    </tr>
  );

  return (
    <>
      <div className="card p-3 mb-4">
        <h5>Mark Attendance</h5>
        {msg && <div className="alert alert-danger py-2">{msg}</div>}
        <div>
          <button className="btn btn-success me-2" onClick={() => act('checkin')}>Check In</button>
          <button className="btn btn-outline-danger" onClick={() => act('checkout')}>Check Out</button>
        </div>
      </div>

      <h5>My Records</h5>
      <div className="card table-responsive mb-4">
        <table className="table mb-0">
          <thead><tr><th>Date</th><th>In</th><th>Out</th><th>Status</th></tr></thead>
          <tbody>
            {mine.map((r) => <Row key={r._id} r={r} />)}
            {mine.length === 0 && <tr><td colSpan="4" className="text-center text-muted">No records</td></tr>}
          </tbody>
        </table>
      </div>

      {user.role !== 'employee' && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">{user.role === 'hr' ? 'All Employees' : 'Team'} Attendance</h5>
            <input type="date" className="form-control w-auto" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="card table-responsive">
            <table className="table mb-0">
              <thead><tr><th>Employee</th><th>Date</th><th>In</th><th>Out</th><th>Status</th></tr></thead>
              <tbody>
                {all.map((r) => <Row key={r._id} r={r} showName />)}
                {all.length === 0 && <tr><td colSpan="5" className="text-center text-muted">No records</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
