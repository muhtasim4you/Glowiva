import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { FaThLarge, FaThList, FaBars } from 'react-icons/fa';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('default');
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    inStock: false
  });

  useEffect(() => {
    fetchCategory();
    setCurrentPage(1); // Reset to first page when category changes
  }, [slug]);

  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [category, currentPage, sortBy, filters]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/categories/${slug}`);
      setCategory(data.data);
    } catch (error) {
      console.error('Failed to fetch category:', error);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Filter by category ID
      params.append('category', category._id);
      
      // Price filters
      if (filters.minPrice) {
        params.append('price[gte]', filters.minPrice);
      }
      if (filters.maxPrice) {
        params.append('price[lte]', filters.maxPrice);
      }
      
      // Stock filter
      if (filters.inStock) {
        params.append('stock[gt]', 0);
      }
      
      // Pagination
      params.append('page', currentPage);
      params.append('limit', 12);
      
      // Sorting
      if (sortBy !== 'default') {
        params.append('sort', sortBy);
      }

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.data || []);
      setPagination(data.pagination || {});
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handlePriceFilter = () => {
    setFilters({
      ...filters,
      minPrice: priceRange.min,
      maxPrice: priceRange.max
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setPriceRange({ min: 0, max: 10000 });
    setFilters({
      minPrice: '',
      maxPrice: '',
      inStock: false
    });
    setCurrentPage(1);
  };

  const handleStockFilter = (e) => {
    setFilters({
      ...filters,
      inStock: e.target.checked
    });
    setCurrentPage(1);
  };

  if (loading && !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!category && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Category not found</h2>
          <Link to="/" className="text-primary-500 hover:underline mt-4 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumbs & Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm mb-4 opacity-90">
            <Link to="/" className="hover:text-pink-200 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span>Shop</span>
            <span>/</span>
            <span>{category?.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {category?.name}
          </h1>
          {category?.description && (
            <p className="text-lg opacity-90 max-w-2xl">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Showing {products.length} of {pagination.total || products.length} products
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="default">Default sorting</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-ratings">Top Rated</option>
              <option value="-createdAt">Newest First</option>
              <option value="name">Name: A to Z</option>
              <option value="-name">Name: Z to A</option>
            </select>

            {/* View Mode Buttons */}
            <div className="flex border border-gray-300 rounded overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <FaBars />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-6 text-gray-800 border-b pb-2">
                FILTERS
              </h3>
              
              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-700">PRICE RANGE</h4>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full accent-primary-500"
                />
                <div className="flex justify-between text-sm mt-2 text-gray-600">
                  <span>{priceRange.min}৳</span>
                  <span>{priceRange.max}৳</span>
                </div>
              </div>

              <button
                onClick={handlePriceFilter}
                className="w-full bg-primary-500 text-white py-2 rounded hover:bg-primary-600 transition-colors mb-3"
              >
                APPLY FILTER
              </button>

              {/* Stock Status */}
              <div className="mb-6 pt-4 border-t">
                <h4 className="font-semibold mb-3 text-gray-700">AVAILABILITY</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={handleStockFilter}
                    className="rounded accent-primary-500"
                  />
                  <span className="text-gray-600">In Stock Only</span>
                </label>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-xl text-gray-600 mb-4">No products found in this category</p>
                <p className="text-gray-500 mb-6">Try adjusting your filters or check back later</p>
                <Link
                  to="/"
                  className="inline-block bg-primary-500 text-white px-6 py-3 rounded hover:bg-primary-600 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className={`grid ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'grid-cols-1 gap-4'
                }`}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {(pagination.next || pagination.prev) && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.prev}
                      className="px-4 py-2 bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                    
                    <span className="px-4 py-2 bg-primary-500 text-white rounded">
                      Page {currentPage}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.next}
                      className="px-4 py-2 bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
