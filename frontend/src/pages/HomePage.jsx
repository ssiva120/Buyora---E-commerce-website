import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import api from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, query]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = '/products';
      if (query) {
        url = `/products/search?q=${encodeURIComponent(query)}`;
      } else if (selectedCategory !== 'all') {
        url = `/products/category/${selectedCategory}`;
      }
      const res = await api.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      {!query && (
        <section className="hero-banner">
          <div className="hero-text">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
              <Sparkles className="w-4 h-4" /> Next-Gen Shopping
            </div>
            <h1>Smart Choices, Everyday Low Prices.</h1>
            <p>Explore curated collections in electronics, style essentials, home decor, and tech books with express delivery.</p>
            <a href="#products-section" className="hero-btn">
              Explore Deals <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      )}

      {/* Category Filter Chips */}
      <div className="category-bar" id="products-section">
        <button
          className={`category-chip ${selectedCategory === 'all' && !query ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-chip ${selectedCategory === cat.slug ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
          {query ? `Search results for "${query}"` : selectedCategory === 'all' ? 'Featured Products' : `${selectedCategory.toUpperCase()} Products`}
        </h2>
        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
          {products.length} items found
        </span>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>No products found.</p>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>Try clearing filters or search query.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
