import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <figure className="relative">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/400x300'}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
        </Link>
        {hasDiscount && (
          <div className="badge badge-secondary absolute top-2 right-2">
            -{discountPercent}%
          </div>
        )}
        {product.stock === 0 && (
          <div className="badge badge-error absolute top-2 left-2">Out of Stock</div>
        )}
      </figure>
      
      <div className="card-body">
        <Link to={`/products/${product._id}`}>
          <h2 className="card-title hover:text-primary transition-colors">
            {product.name}
          </h2>
        </Link>
        
        <p className="text-sm text-base-content/70 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 mt-2">
          <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-sm line-through text-base-content/50">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className="badge badge-outline">{product.category}</div>
          {product.rating > 0 && (
            <div className="rating rating-sm">
              <span>⭐ {product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <div className="card-actions justify-end mt-4">
          <button
            onClick={() => onAddToCart(product._id)}
            disabled={product.stock === 0}
            className="btn btn-primary btn-block"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
