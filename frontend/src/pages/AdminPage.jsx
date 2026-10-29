import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Package, ShoppingBag } from 'lucide-react';
import api from '../api/axiosInstance';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State for New Product
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    brand: '',
    categoryId: 1
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, orderRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/admin/orders')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setOrders(orderRes.data);
      if (catRes.data.length > 0) {
        setNewProduct(prev => ({ ...prev, categoryId: catRes.data[0].id }));
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stockQuantity: parseInt(newProduct.stockQuantity)
      };
      await api.post('/admin/products', payload);
      alert('Product created successfully!');
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        imageUrl: '',
        brand: '',
        categoryId: categories[0]?.id || 1
      });
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${id}`);
        fetchAdminData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status?status=${newStatus}`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
          Admin Dashboard
        </h1>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('products')}
            className={`btn-secondary ${activeTab === 'products' ? 'active' : ''}`}
            style={activeTab === 'products' ? { background: '#2563eb', color: '#fff' } : {}}
          >
            <ShoppingBag className="w-4 h-4" /> Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`btn-secondary ${activeTab === 'orders' ? 'active' : ''}`}
            style={activeTab === 'orders' ? { background: '#2563eb', color: '#fff' } : {}}
          >
            <Package className="w-4 h-4" /> Orders ({orders.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading dashboard data...</div>
      ) : activeTab === 'products' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Add Product Form */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus className="w-5 h-5 text-blue-600" /> Add New Product
            </h2>

            <form onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  className="form-control"
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: parseInt(e.target.value) })}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock Qty *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Brand</label>
                <input
                  type="text"
                  className="form-control"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  className="form-control"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
                Save Product
              </button>
            </form>
          </div>

          {/* Existing Products List */}
          <div className="table-container" style={{ maxHeight: '650px', overflowY: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.categoryName} • {p.brand || 'No brand'}</div>
                    </td>
                    <td style={{ fontWeight: 700 }}>${p.price?.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${p.stockQuantity > 5 ? 'badge-success' : 'badge-danger'}`}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        style={{ color: '#ef4444', padding: '0.4rem' }}
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Orders Management Tab */
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700 }}>#{o.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.userFullName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{o.userEmail}</div>
                  </td>
                  <td style={{ fontWeight: 800, color: '#2563eb' }}>${o.totalAmount?.toFixed(2)}</td>
                  <td>
                    <span className="badge badge-info">{o.status}</span>
                  </td>
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem' }}
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
