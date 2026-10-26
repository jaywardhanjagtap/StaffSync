import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const links = [
    ['/', 'Dashboard'],
    ...(user.role !== 'employee' ? [['/employees', user.role === 'hr' ? 'Employees' : 'My Team']] : []),
    ['/leaves', 'Leaves'],
    ['/attendance', 'Attendance'],
    ['/announcements', 'News'],
    ['/trainings', 'Training'],
    ['/profile', 'Profile']
  ];
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <span className="navbar-brand brand">StaffSync</span>
        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nv">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nv">
          <ul className="navbar-nav me-auto">
            {links.map(([to, label]) => (
              <li className="nav-item" key={to}>
                <NavLink end={to === '/'} to={to} className="nav-link">{label}</NavLink>
              </li>
            ))}
          </ul>
          <span className="navbar-text me-3">{user.name} <span className="badge bg-light text-primary text-uppercase">{user.role}</span></span>
          <button className="btn btn-outline-light btn-sm" onClick={() => { logout(); nav('/login'); }}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
