import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  StarIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, page, pages, total } = useSelector((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [currentPage, setCurrentPage] = useState(() => parseInt(searchParams.get('page')) || 1);
  const [category, setCategory] = useState(() => searchParams.get('category') || '');
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const categories = ['Electronics', 'Clothing', 'Accessories', 'Home & Kitchen', 'Sports', 'Books', 'Toys'];

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage);
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    setSearchParams(params, { replace: true });
    
    dispatch(fetchProducts({ page: currentPage, limit: 12, category, search }));
  }, [dispatch, currentPage, category, search, setSearchParams]);

  // Sort products
  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    // Filter by price range
    if (priceRange.min || priceRange.max) {
      sorted = sorted.filter((product) => {
        const price = product.price;
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    return sorted;
  }, [products, sortBy, priceRange]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative w-4 h-4">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <div className="absolute top-0 left-0 w-2 h-4 overflow-hidden">
            <StarIconSolid className="w-4 h-4 text-yellow-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">All Products</h1>
        <p className="text-gray-600">
          {loading ? 'Loading...' : `Showing ${sortedProducts.length} of ${total} products`}
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name: A to Z</option>
          </select>

          {/* View Toggle */}
          <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition ${
              showFilters ? 'bg-gray-100 border-gray-500' : ''
            }`}
          >
            <FunnelIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setPriceRange({ min: '', max: '' })}
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(category || search || priceRange.min || priceRange.max) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {category && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-900 rounded-full text-sm">
                Category: {category}
                <button
                  onClick={() => handleCategoryChange('')}
                  className="hover:text-black"
                >
                  ×
                </button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-900 rounded-full text-sm">
                Search: {search}
                <button
                  onClick={() => handleSearchChange('')}
                  className="hover:text-black"
                >
                  ×
                </button>
              </span>
            )}
            {(priceRange.min || priceRange.max) && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-900 rounded-full text-sm">
                Price: ${priceRange.min || '0'} - ${priceRange.max || '∞'}
                <button
                  onClick={() => setPriceRange({ min: '', max: '' })}
                  className="hover:text-black"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Products Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="w-full h-64 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setCategory('');
              setSearch('');
              setPriceRange({ min: '', max: '' });
              setCurrentPage(1);
            }}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {product.stock > 0 && product.stock < 10 && (
                      <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Only {product.stock} left!
                      </div>
                    )}
                    {product.rating >= 4.5 && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <StarIconSolid className="w-3 h-3" />
                        Top Rated
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-gray-200 text-gray-900 text-xs font-semibold rounded capitalize">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    {product.rating > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">{renderStars(product.rating)}</div>
                        <span className="text-sm text-gray-600">
                          {product.rating.toFixed(1)} ({product.numReviews})
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-extrabold text-black">${product.price}</p>
                        {product.stock > 0 && (
                          <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <CheckIcon className="w-3 h-3" />
                            In Stock
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row"
                >
                  <div className="relative w-full md:w-64 h-64 md:h-auto bg-gray-100 overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="inline-block px-2 py-1 bg-gray-200 text-gray-900 text-xs font-semibold rounded capitalize mb-2">
                            {product.category}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black transition">
                            {product.name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-extrabold text-black">${product.price}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                      {product.rating > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center">{renderStars(product.rating)}</div>
                          <span className="text-sm text-gray-600">
                            {product.rating.toFixed(1)} ({product.numReviews} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                          {product.stock > 0 ? (
                            <span className="flex items-center gap-1">
                              <CheckIcon className="w-4 h-4" />
                              {product.stock} in stock
                            </span>
                          ) : (
                            'Out of stock'
                          )}
                        </span>
                      </div>
                      <span className="text-gray-900 font-semibold group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, pages))].map((_, i) => {
                    let pageNum;
                    if (pages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pages - 2) {
                      pageNum = pages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 border rounded-lg min-w-[40px] ${
                          currentPage === pageNum
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
                  disabled={currentPage === pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Page {currentPage} of {pages}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
