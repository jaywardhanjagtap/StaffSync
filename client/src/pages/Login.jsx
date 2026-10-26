import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { errMsg } from '../api';

export default function Login() {
  const { login, register } = useAuth();
  const [isReg, setIsReg] = useState(false);
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (isReg) await register(f.name, f.email, f.password);
      else await login(f.email, f.password);
    } catch (x) { setErr(errMsg(x)); }
  };

  return (
    <div className="auth-wrap">
      <div className="card p-4">
        <h3 className="brand text-primary text-center">StaffSync</h3>
        <p className="text-center text-muted">{isReg ? 'Create employee account' : 'Sign in to continue'}</p>
        {err && <div className="alert alert-danger py-2">{err}</div>}
        <form onSubmit={submit}>
          {isReg && <input className="form-control mb-3" placeholder="Full name" value={f.name} onChange={set('name')} required />}
          <input type="email" className="form-control mb-3" placeholder="Email" value={f.email} onChange={set('email')} required />
          <input type="password" className="form-control mb-3" placeholder="Password (min 6)" minLength={6} value={f.password} onChange={set('password')} required />
          <button className="btn btn-primary w-100">{isReg ? 'Register' : 'Login'}</button>
        </form>
        <button className="btn btn-link mt-2" onClick={() => setIsReg(!isReg)}>
          {isReg ? 'Have account? Login' : 'New employee? Register'}
        </button>
      </div>
    </div>
  );
}
