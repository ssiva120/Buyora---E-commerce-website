import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    const success = await addToCart(product.id, 1);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="card-img-wrap">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          loading="lazy"
        />
      </Link>

      <div className="card-body">
        <div className="card-category">{product.categoryName || 'General'}</div>
        <Link to={`/product/${product.id}`} className="card-title" title={product.name}>
          {product.name}
        </Link>

        <div className="card-rating">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span style={{ fontWeight: 700 }}>{product.rating || 4.5}</span>
          <span style={{ color: '#94a3b8' }}>({product.reviewCount || 10})</span>
        </div>

        <div className="card-footer">
          <div className="card-price">${product.price?.toFixed(2)}</div>
          
          <button
            onClick={handleAdd}
            className="btn-add-cart"
            style={added ? { background: '#10b981', color: '#fff' } : {}}
            disabled={product.stockQuantity <= 0}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added</span>
              </>
            ) : product.stockQuantity <= 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
