import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { fetchCart } from '../../store/slices/cartSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleCartClick = () => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      navigate('/cart');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-black">
          Nova Bloom
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/products"
              className="text-gray-700 hover:text-black transition"
            >
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <button
                  onClick={handleCartClick}
                  className="relative text-gray-700 hover:text-black transition"
                >
                  Cart
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-black transition"
                >
                  Orders
                </Link>

                {user?.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/products"
                      className="text-gray-700 hover:text-black transition"
                    >
                      Admin Products
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="text-gray-700 hover:text-black transition"
                    >
                      Admin Orders
                    </Link>
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Hello, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-black transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-black transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

