import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../api/axiosInstance';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shippingAddress: user?.address || '123 Tech Boulevard, Apt 4B, Silicon City',
    phone: user?.phone || '+1 555-0199',
    paymentMethod: 'COD'
  });

  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.shippingAddress || !formData.phone) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/orders', formData);
      setSuccessOrder(res.data);
      clearCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto', background: '#fff', padding: '2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
        <CheckCircle2 className="w-16 h-16 text-emerald-500" style={{ margin: '0 auto 1rem auto', color: '#10b981' }} />
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>Order Confirmed!</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Thank you for shopping with BUYOra. Your order has been placed successfully.</p>

        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', margin: '1.5rem 0', textAlign: 'left', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#64748b' }}>Order ID:</span>
            <span style={{ fontWeight: 700 }}>#{successOrder.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#64748b' }}>Total Amount:</span>
            <span style={{ fontWeight: 700, color: '#2563eb' }}>${successOrder.totalAmount?.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#64748b' }}>Payment Method:</span>
            <span style={{ fontWeight: 700 }}>{successOrder.paymentMethod}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Shipping to:</span>
            <span style={{ fontWeight: 600 }}>{successOrder.shippingAddress}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/orders" className="btn-primary">View My Orders</Link>
          <Link to="/" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.totalAmount || 0;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const finalTotal = Math.round((subtotal + shipping + tax) * 100) / 100;

  return (
    <div>
      <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem' }}>
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem' }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Shipping & Payment Form */}
        <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem' }}>1. Delivery Address</h2>

          <div className="form-group">
            <label>Full Delivery Address *</label>
            <textarea
              rows="3"
              className="form-control"
              value={formData.shippingAddress}
              onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="text"
              className="form-control"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '1.5rem 0 1rem 0' }}>2. Payment Method</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', background: formData.paymentMethod === 'COD' ? '#eff6ff' : '#fff' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={formData.paymentMethod === 'COD'}
                onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Cash on Delivery (COD)</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pay in cash upon doorstep package arrival.</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', background: formData.paymentMethod === 'CARD' ? '#eff6ff' : '#fff' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="CARD"
                checked={formData.paymentMethod === 'CARD'}
                onChange={() => setFormData({ ...formData, paymentMethod: 'CARD' })}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Credit / Debit Card (Simulated Gateway)</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Instant authorization (Test Mode).</div>
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Processing Order...' : `Place Order • $${finalTotal.toFixed(2)}`}
          </button>
        </form>

        {/* Mini Order Summary */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem' }}>Items in Order ({cart.totalItems})</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto', marginBottom: '1.25rem' }}>
            {cart.items?.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600, color: '#334155', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.quantity}x {item.productName}
                </span>
                <span style={{ fontWeight: 700 }}>${item.subTotal?.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
            <span>Subtotal</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>${subtotal.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
            <span>Shipping</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
            <span>Tax (5%)</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>${tax.toFixed(2)}</span>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Total Payable</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2563eb' }}>${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
