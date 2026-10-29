import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import api from '../api/axiosInstance';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const success = await addToCart(product.id, quantity);
    if (success) {
      navigate('/cart');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading product details...</div>;
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Product not found</h2>
        <Link to="/" className="btn-primary" style={{ marginTop: '1rem' }}>Back to Home</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem' }}>
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', background: '#fff', padding: '2rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
        {/* Product Image */}
        <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#f8fafc', border: '1px solid #f1f5f9', maxHeight: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Product Info */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {product.categoryName} • {product.brand || 'BUYOra'}
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0.4rem 0 0.8rem 0' }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#d97706', fontWeight: 700 }}>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.5}</span>
            </div>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{product.reviewCount || 12} customer reviews</span>
          </div>

          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            ${product.price?.toFixed(2)}
          </div>

          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {product.description}
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Availability: </span>
            {product.stockQuantity > 0 ? (
              <span className="badge badge-success">In Stock ({product.stockQuantity} available)</span>
            ) : (
              <span className="badge badge-danger">Out of Stock</span>
            )}
          </div>

          {/* Quantity and Actions */}
          {product.stockQuantity > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '0.5rem 0.9rem', background: '#f1f5f9', fontWeight: 700 }}
                >-</button>
                <span style={{ padding: '0.5rem 1rem', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  style={{ padding: '0.5rem 0.9rem', background: '#f1f5f9', fontWeight: 700 }}
                >+</button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary"
                style={{ flex: 1, padding: '0.85rem' }}
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
            </div>
          )}

          {/* Value Badges */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              <Truck className="w-4 h-4" style={{ margin: '0 auto 0.25rem auto', color: '#2563eb' }} />
              <span>Fast Shipping</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              <ShieldCheck className="w-4 h-4" style={{ margin: '0 auto 0.25rem auto', color: '#10b981' }} />
              <span>100% Genuine</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              <RotateCcw className="w-4 h-4" style={{ margin: '0 auto 0.25rem auto', color: '#f59e0b' }} />
              <span>7 Days Return</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
