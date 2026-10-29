import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, LogOut, ShieldAlert, Package, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        {/* Logo */}
        <Link to="/" className="logo">
          <ShoppingBag className="w-7 h-7" style={{ color: '#2563eb' }} />
          <span>BUYOra</span>
          <span className="logo-badge">STORE</span>
        </Link>

        {/* Search Bar */}
        <form className="nav-search" onSubmit={handleSearch}>
          <Search className="search-icon w-4 h-4" />
          <input
            type="text"
            placeholder="Search products, categories, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Navigation Actions */}
        <div className="nav-actions">
          <Link to="/" className="nav-link">Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/orders" className="nav-link">
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </Link>

              {isAdmin && (
                <Link to="/admin" className="nav-link" style={{ color: '#2563eb' }}>
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}

              <Link to="/cart" className="cart-icon-btn" title="Shopping Cart">
                <ShoppingCart className="w-5 h-5" />
                {cart.totalItems > 0 && (
                  <span className="cart-badge">{cart.totalItems}</span>
                )}
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                  Hi, {user?.fullName?.split(' ')[0] || 'User'}
                </span>
                <button
                  onClick={logout}
                  className="nav-link"
                  title="Logout"
                  style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.35rem 0.65rem', borderRadius: '6px' }}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
