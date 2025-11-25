import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import { useCartStore } from '../store/cartStore';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    await addToCart(product._id, quantity);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="btn btn-ghost mb-6">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="mb-4">
            <img
              src={product.images?.[selectedImage]?.url || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`${product.name} ${idx + 1}`}
                  className={`h-24 object-cover rounded cursor-pointer ${
                    selectedImage === idx ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="badge badge-outline mb-2">{product.category}</div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-2xl line-through text-base-content/50">
                  ${product.comparePrice.toFixed(2)}
                </span>
                <div className="badge badge-secondary">-{discountPercent}%</div>
              </>
            )}
          </div>

          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="rating rating-sm">
                <span className="text-lg">⭐ {product.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-base-content/60">
                ({product.numReviews} reviews)
              </span>
            </div>
          )}

          <p className="text-lg mb-6">{product.description}</p>

          <div className="divider"></div>

          <div className="mb-6">
            <p className="text-sm mb-2">
              Stock: <span className="font-bold">{product.stock} available</span>
            </p>
            
            {product.stock > 0 ? (
              <div className="flex items-center gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Quantity</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="input input-bordered w-24"
                  />
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary btn-lg flex-1 mt-8"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
              </div>
            ) : (
              <button className="btn btn-disabled btn-lg w-full">Out of Stock</button>
            )}
          </div>

          {product.tags?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm mb-2">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, idx) => (
                  <div key={idx} className="badge badge-outline">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
