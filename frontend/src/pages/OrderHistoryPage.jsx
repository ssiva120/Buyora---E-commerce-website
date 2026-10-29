import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle } from 'lucide-react';
import api from '../api/axiosInstance';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my-orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="badge badge-success">Delivered</span>;
      case 'SHIPPED':
        return <span className="badge badge-info">Shipped</span>;
      case 'PROCESSING':
        return <span className="badge badge-warning">Processing</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-warning">{status}</span>;
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
        My Order History
      </h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <Package className="w-12 h-12 text-gray-400" style={{ margin: '0 auto 1rem auto' }} />
          <h2>No orders placed yet</h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1.5rem' }}>When you place orders, they will appear here with live tracking status.</p>
          <Link to="/" className="btn-primary">Explore Products</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Order #{order.id}</span>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                    Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {getStatusBadge(order.status)}
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb' }}>
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items in this order */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {order.items?.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={item.productImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                        alt={item.productName}
                        style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px', background: '#f1f5f9' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{item.productName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Qty: {item.quantity} × ${item.priceAtPurchase?.toFixed(2)}</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700 }}>${item.subTotal?.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '1rem', paddingTop: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
                Shipping Address: <strong style={{ color: '#334155' }}>{order.shippingAddress}</strong> • Payment: <strong style={{ color: '#334155' }}>{order.paymentMethod}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
