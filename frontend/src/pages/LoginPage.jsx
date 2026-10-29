import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const setDemoUser = (type) => {
    if (type === 'admin') {
      setEmail('admin@buyora.com');
      setPassword('admin123');
    } else {
      setEmail('john@example.com');
      setPassword('password123');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '2rem auto', background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'inline-flex', background: '#dbeafe', color: '#2563eb', padding: '0.75rem', borderRadius: '12px', marginBottom: '0.75rem' }}>
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome Back</h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Log in to your BUYOra account to continue shopping.</p>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            className="form-control"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {/* Quick Demo Logins for Testing & Interviews */}
      <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Quick Demo Credentials
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
          <button
            type="button"
            onClick={() => setDemoUser('customer')}
            className="btn-secondary"
            style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}
          >
            Demo Customer
          </button>
          <button
            type="button"
            onClick={() => setDemoUser('admin')}
            className="btn-secondary"
            style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem', background: '#eff6ff', color: '#2563eb' }}
          >
            Demo Admin
          </button>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '1.25rem' }}>
        Don't have an account? <Link to="/register" style={{ color: '#2563eb', fontWeight: 700 }}>Sign up</Link>
      </p>
    </div>
  );
}
