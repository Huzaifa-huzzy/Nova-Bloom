import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct, fetchRelatedProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import {
  StarIcon,
  ShoppingCartIcon,
  HeartIcon,
  ShareIcon,
  CheckIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, relatedProducts, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      // Fetch related products from the same category
      dispatch(fetchRelatedProducts({ 
        category: product.category, 
        excludeId: product._id,
        limit: 4 
      }));
    }
  }, [dispatch, product]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (quantity > product.stock) {
      toast.error('Insufficient stock');
      return;
    }

    dispatch(addToCart({ productId: id, quantity }))
      .unwrap()
      .then(() => {
        toast.success('Product added to cart');
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIconSolid key={i} className="w-5 h-5 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative w-5 h-5">
          <StarIcon className="w-5 h-5 text-yellow-400" />
          <div className="absolute top-0 left-0 w-2.5 h-5 overflow-hidden">
            <StarIconSolid className="w-5 h-5 text-yellow-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      );
    }

    return stars;
  };

  if (loading && !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 mb-4">Product not found</p>
        <Link to="/products" className="text-gray-900 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-gray-900 flex items-center gap-1">
          <HomeIcon className="w-4 h-4" />
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-gray-900">
          Products
        </Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-gray-900 capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-600 text-white px-6 py-3 rounded-full text-lg font-bold">
                  Out of Stock
                </span>
              </div>
            )}
            {product.stock > 0 && product.stock < 10 && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                Only {product.stock} left!
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery (if multiple images) */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedImage(product.image)}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                selectedImage === product.image ? 'border-gray-900' : 'border-gray-200'
              }`}
            >
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              {product.rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">{renderStars(product.rating)}</div>
                  <span className="text-gray-600">
                    {product.rating.toFixed(1)} ({product.numReviews} reviews)
                  </span>
                </div>
              )}
              {product.rating === 0 && (
                <span className="text-gray-500 text-sm">No reviews yet</span>
              )}
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-extrabold text-black">${product.price}</span>
            {product.stock > 0 && (
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <CheckIcon className="w-5 h-5" />
                In Stock
              </span>
            )}
          </div>

          <p className="text-lg text-gray-700 leading-relaxed">{product.description}</p>

          {/* Product Highlights */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-3">
            <h3 className="font-bold text-lg mb-3">Product Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <TruckIcon className="w-5 h-5 text-gray-900" />
                <span className="text-gray-700">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-gray-900" />
                <span className="text-gray-700">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700">Premium Quality</span>
              </div>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Quantity:</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
                <span className="text-gray-600 ml-4">
                  {product.stock} available
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={handleShare}
                className="px-6 py-4 border-2 border-gray-300 rounded-xl hover:border-gray-900 hover:bg-gray-100 transition"
                title="Share product"
              >
                <ShareIcon className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Category:</span>
                <Link
                  to={`/products?category=${product.category}`}
                  className="ml-2 text-gray-900 hover:underline font-medium capitalize"
                >
                  {product.category}
                </Link>
              </div>
              <div>
                <span className="text-gray-600">Stock:</span>
                <span className="ml-2 font-medium">{product.stock} units</span>
              </div>
              <div>
                <span className="text-gray-600">SKU:</span>
                <span className="ml-2 font-medium">{product._id.slice(-8).toUpperCase()}</span>
              </div>
              <div>
                <span className="text-gray-600">Rating:</span>
                <span className="ml-2 font-medium">
                  {product.rating > 0 ? `${product.rating.toFixed(1)}/5` : 'Not rated'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-12">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-semibold border-b-2 transition capitalize ${
                  activeTab === tab
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
              <div className="mt-6 space-y-3">
                <h3 className="text-xl font-bold text-gray-900">Key Features</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Premium quality materials</li>
                  <li>Designed for durability and performance</li>
                  <li>Customer satisfaction guaranteed</li>
                  <li>Easy to use and maintain</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium capitalize">{product.category}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Price</span>
                  <span className="font-medium">${product.price}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Stock Available</span>
                  <span className="font-medium">{product.stock} units</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-medium">
                    {product.rating > 0 ? `${product.rating.toFixed(1)}/5` : 'Not rated'}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-medium">{product.numReviews}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Warranty & Support</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span>1-year manufacturer warranty</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span>24/7 customer support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span>Free returns within 30 days</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {product.numReviews > 0 ? (
                <div className="space-y-6">
                  <div className="bg-gray-100 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl font-bold">{product.rating.toFixed(1)}</div>
                      <div>
                        <div className="flex items-center mb-1">{renderStars(product.rating)}</div>
                        <div className="text-gray-600">Based on {product.numReviews} reviews</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                            {String.fromCharCode(65 + i)}
                          </div>
                          <div>
                            <div className="font-bold">Customer {i}</div>
                            <div className="flex items-center gap-1">
                              {renderStars(product.rating)}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">
                          Great product! Highly recommend it. Quality is excellent and delivery was fast.
                        </p>
                        <div className="text-sm text-gray-500 mt-2">Verified Purchase</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-gray-600 text-lg mb-2">No reviews yet</p>
                  <p className="text-gray-500">Be the first to review this product!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Related Products</h2>
            <Link
              to={`/products?category=${product.category}`}
              className="text-gray-900 hover:text-black font-semibold flex items-center gap-2"
            >
              View All
              <ArrowLeftIcon className="w-5 h-5 rotate-180" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct._id}
                to={`/products/${relatedProduct._id}`}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {relatedProduct.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-900 transition">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    {relatedProduct.rating > 0 && (
                      <>
                        <div className="flex items-center">
                          {renderStars(relatedProduct.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({relatedProduct.numReviews})
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-2xl font-extrabold text-black">${relatedProduct.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
