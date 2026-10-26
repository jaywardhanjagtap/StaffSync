import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import api, { fmtDate } from '../api';

export default function Dashboard() {
  const { user } = useAuth();
  const [news, setNews] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    api.get('/announcements').then((r) => setNews(r.data.slice(0, 5)));
    (async () => {
      if (user.role === 'employee') {
        const [l, a] = await Promise.all([api.get('/leaves/mine'), api.get('/attendance/mine')]);
        setStats([
          ['My Pending Leaves', l.data.filter((x) => x.status === 'pending').length],
          ['Approved Leaves', l.data.filter((x) => x.status === 'approved').length],
          ['Days Present', a.data.length]
        ]);
      } else {
        const [u, l] = await Promise.all([api.get('/users'), api.get('/leaves')]);
        setStats([
          [user.role === 'hr' ? 'Employees' : 'Team Members', u.data.length],
          ['Pending Leave Requests', l.data.filter((x) => x.status === 'pending').length],
          ['Total Leave Requests', l.data.length]
        ]);
      }
    })();
  }, [user]);

  return (
    <>
      <h4 className="mb-3">Welcome, {user.name}</h4>
      <div className="row g-3 mb-4">
        {stats.map(([label, n]) => (
          <div className="col-md-4" key={label}>
            <div className="card p-3 text-center">
              <div className="display-6 text-primary">{n}</div>
              <div className="text-muted">{label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-3">
        <h5>Latest Announcements & News</h5>
        {news.length === 0 && <p className="text-muted mb-0">Nothing yet.</p>}
        {news.map((n) => (
          <div key={n._id} className="border-bottom py-2">
            <strong>{n.title}</strong> <span className="badge bg-secondary">{n.type}</span>
            <div>{n.message}</div>
            <small className="text-muted">{fmtDate(n.createdAt)}</small>
          </div>
        ))}
      </div>
    </>
  );
}
