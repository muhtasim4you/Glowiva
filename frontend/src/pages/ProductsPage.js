import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { FaThLarge, FaThList, FaBars } from 'react-icons/fa';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('default');
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  // Initialize filters from URL params
  const subcategory = searchParams.get('subcategory') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';

  const [filters, setFilters] = useState({
    category: category,
    subcategory: subcategory,
    brand: brand,
    minPrice: '',
    maxPrice: ''
  });

  // Update filters when URL params change
  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || '',
      subcategory: searchParams.get('subcategory') || '',
      brand: searchParams.get('brand') || '',
      minPrice: '',
      maxPrice: ''
    });
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortBy, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.subcategory) {
        params.append('subcategory', filters.subcategory);
      }
      if (filters.category) {
        params.append('category', filters.category);
      }
      if (filters.brand) {
        params.append('brand', filters.brand);
      }
      if (filters.minPrice) {
        params.append('price[gte]', filters.minPrice);
      }
      if (filters.maxPrice) {
        params.append('price[lte]', filters.maxPrice);
      }
      
      params.append('page', currentPage);
      params.append('limit', 9);
      
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
      category: searchParams.get('category') || '',
      subcategory: searchParams.get('subcategory') || '',
      brand: '',
      minPrice: '',
      maxPrice: ''
    });
    setCurrentPage(1);
  };

  const getBreadcrumbs = () => {
    const crumbs = [{ name: 'Home', path: '/' }];
    
    if (filters.category) {
      crumbs.push({ name: 'Skin Care', path: '/category/skin-care' });
    }
    
    if (filters.subcategory) {
      crumbs.push({ name: filters.subcategory, path: '' });
    }
    
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm mb-4">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {crumb.path ? (
                  <Link to={crumb.path} className="hover:text-primary-400">
                    {crumb.name}
                  </Link>
                ) : (
                  <span>{crumb.name}</span>
                )}
                {index < breadcrumbs.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </div>
          <h1 className="text-4xl font-bold">
            {filters.subcategory || filters.category || 'All Products'}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-4">FILTER BY PRICE</h3>
              
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm mt-2">
                  <span>Price: {priceRange.min}৳</span>
                  <span>{priceRange.max}৳</span>
                </div>
              </div>

              <button
                onClick={handlePriceFilter}
                className="w-full bg-primary-500 text-white py-2 rounded hover:bg-primary-600 mb-4"
              >
                FILTER
              </button>

              <button
                onClick={clearFilters}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
              >
                Clear Filters
              </button>

              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">STOCK STATUS</h3>
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" className="rounded" />
                  <span>On sale</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>In stock</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:w-3/4">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Show: 9 / {pagination.total || products.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'text-primary-500' : 'text-gray-400'}`}
                    >
                      <FaThLarge />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'text-primary-500' : 'text-gray-400'}`}
                    >
                      <FaThList />
                    </button>
                    <button
                      onClick={() => setViewMode('compact')}
                      className={`p-2 ${viewMode === 'compact' ? 'text-primary-500' : 'text-gray-400'}`}
                    >
                      <FaBars />
                    </button>
                  </div>
                </div>

                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="default">Default sorting</option>
                  <option value="name">Name: A to Z</option>
                  <option value="-name">Name: Z to A</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-createdAt">Newest First</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No products found</p>
              </div>
            ) : (
              <>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.total > 9 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex gap-2">
                      {currentPage > 1 && (
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className="px-4 py-2 bg-white rounded shadow hover:bg-primary-500 hover:text-white"
                        >
                          Previous
                        </button>
                      )}
                      
                      {Array.from({ length: Math.ceil((pagination.total || products.length) / 9) }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded shadow ${
                            currentPage === page
                              ? 'bg-primary-500 text-white'
                              : 'bg-white hover:bg-primary-500 hover:text-white'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      {pagination.next && (
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="px-4 py-2 bg-white rounded shadow hover:bg-primary-500 hover:text-white"
                        >
                          Next
                        </button>
                      )}
                    </div>
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

export default ProductsPage;
