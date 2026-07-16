import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { FaThLarge, FaThList, FaGift } from 'react-icons/fa';

const ComboPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchComboProducts();
  }, [sortBy]);

  const fetchComboProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch category with type 'combo'
      const { data: categoriesData } = await api.get('/categories');
      const categories = categoriesData.data || categoriesData || [];
      const comboCategory = categories.find(cat => cat.type === 'combo');
      
      if (!comboCategory) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Fetch products in combo category
      const params = new URLSearchParams();
      params.append('category', comboCategory._id);
      params.append('limit', 50);
      
      if (sortBy !== 'default') {
        params.append('sort', sortBy);
      }

      const { data: productsData } = await api.get(`/products?${params.toString()}`);
      setProducts(productsData.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch combo products:', error);
      setProducts([]);
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm mb-4 opacity-90">
            <Link to="/" className="hover:text-pink-200 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span>Combo Deals</span>
          </div>
          <div className="flex items-center gap-4">
            <FaGift className="text-5xl" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Combo Deals</h1>
              <p className="text-pink-100 text-lg">
                Special combo packages for amazing value
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-600">
            {loading ? 'Loading...' : `${products.length} combo package${products.length !== 1 ? 's' : ''} found`}
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaThList />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="default">Default Sorting</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-createdAt">Newest First</option>
              <option value="name">Name: A to Z</option>
              <option value="-name">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="text-gray-600 mt-4">Loading combo deals...</p>
          </div>
        ) : products.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaGift className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Combo Deals Available</h3>
            <p className="text-gray-600 mb-6">
              Check back soon for exciting combo packages!
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComboPage;
