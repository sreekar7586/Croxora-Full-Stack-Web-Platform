import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, updateCartItem, removeFromCart, loading } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const handleUpdateQuantity = async (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      await updateCartItem(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Please login to view your cart</h2>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item._id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex gap-4">
                    <img
                      src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                      alt={item.product?.name}
                      className="w-24 h-24 object-cover rounded"
                    />

                    <div className="flex-1">
                      <Link
                        to={`/products/${item.product?._id}`}
                        className="text-xl font-bold hover:text-primary"
                      >
                        {item.product?.name}
                      </Link>
                      <p className="text-base-content/60 text-sm mt-1">
                        {item.product?.category}
                      </p>
                      <p className="text-2xl font-bold mt-2">
                        ${item.price?.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="btn btn-ghost btn-sm btn-circle"
                      >
                        <Trash2 size={18} />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity, -1)}
                          className="btn btn-sm btn-circle"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity, 1)}
                          className="btn btn-sm btn-circle"
                          disabled={item.quantity >= item.product?.stock}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <p className="text-lg font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-xl sticky top-4">
            <div className="card-body">
              <h2 className="card-title">Order Summary</h2>
              
              <div className="divider"></div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold">${cart.totalPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold">
                    {cart.totalPrice > 50 ? 'FREE' : '$5.99'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span className="font-bold">
                    ${(cart.totalPrice * 0.1).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="divider"></div>

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>
                  ${(
                    cart.totalPrice +
                    (cart.totalPrice > 50 ? 0 : 5.99) +
                    cart.totalPrice * 0.1
                  ).toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="btn btn-primary btn-block mt-4"
              >
                Proceed to Checkout
              </button>

              <Link to="/products" className="btn btn-ghost btn-block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
