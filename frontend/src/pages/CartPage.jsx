import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <ShoppingBag className="w-12 h-12 text-blue-600" style={{ margin: '0 auto 1rem auto' }} />
        <h2>Please log in to view your shopping cart</h2>
        <Link to="/login" className="btn-primary" style={{ marginTop: '1.25rem' }}>Login to Your Account</Link>
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading cart items...</div>;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <ShoppingBag className="w-12 h-12 text-gray-400" style={{ margin: '0 auto 1rem auto' }} />
        <h2>Your shopping cart is empty</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Looks like you haven't added any items to your cart yet.</p>
        <Link to="/" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  const subtotal = cart.totalAmount || 0;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const finalTotal = Math.round((subtotal + shipping + tax) * 100) / 100;

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
        Shopping Cart ({cart.totalItems} items)
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Cart Items Table */}
        <div className="table-container" style={{ flex: 2 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={item.productImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                      alt={item.productName}
                      style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', background: '#f1f5f9' }}
                    />
                    <Link to={`/product/${item.productId}`} style={{ fontWeight: 700, color: '#1e293b' }}>
                      {item.productName}
                    </Link>
                  </td>
                  <td style={{ fontWeight: 600 }}>${item.price?.toFixed(2)}</td>
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ padding: '0.25rem 0.6rem', background: '#f8fafc', fontWeight: 700 }}
                      >-</button>
                      <span style={{ padding: '0.25rem 0.7rem', fontWeight: 700, fontSize: '0.85rem' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ padding: '0.25rem 0.6rem', background: '#f8fafc', fontWeight: 700 }}
                      >+</button>
                    </div>
                  </td>
                  <td style={{ fontWeight: 800, color: '#0f172a' }}>${item.subTotal?.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ color: '#ef4444', padding: '0.4rem' }}
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>Order Summary</h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: '#475569' }}>
            <span>Subtotal</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>${subtotal.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: '#475569' }}>
            <span>Estimated Shipping</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem', color: '#475569' }}>
            <span>Estimated Tax (5%)</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>${tax.toFixed(2)}</span>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Total</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2563eb' }}>${finalTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
