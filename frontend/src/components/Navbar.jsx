import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Menu } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { fetchCart, getCartCount } = useCartStore();
  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  return (
    <nav className="navbar bg-base-100 shadow-lg">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl font-bold">
            Croxora
          </Link>
        </div>
        
        <div className="flex-none gap-2">
          <Link to="/products" className="btn btn-ghost">
            Products
          </Link>

          <Link to="/cart" className="btn btn-ghost btn-circle indicator">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="badge badge-sm badge-primary indicator-item">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  <User size={20} />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li className="menu-title">
                  <span>{user?.name}</span>
                </li>
                <li>
                  <Link to="/profile">
                    <User size={16} /> Profile
                  </Link>
                </li>
                <li>
                  <Link to="/orders">
                    <Package size={16} /> Orders
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="gap-2 flex">
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
