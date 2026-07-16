import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { FaThLarge, FaThList, FaTags, FaPercent } from 'react-icons/fa';

const OffersPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('default');
  const [filterType, setFilterType] = useState('all'); // all, category-offers, sale-products

  useEffect(() => {
    fetchOfferProducts();
  }, [sortBy, filterType]);

  const fetchOfferProducts = async () => {
    try {
      setLoading(true);
      
      if (filterType === 'category-offers') {
        // Fetch products in offer category
        const { data: categoriesData } = await api.get('/categories');
        const categories = categoriesData.data || categoriesData || [];
        const offerCategory = categories.find(cat => cat.type === 'offer');
        
        if (offerCategory) {
          const params = new URLSearchParams();
          params.append('category', offerCategory._id);
          params.append('limit', 50);
          
          if (sortBy !== 'default') {
            params.append('sort', sortBy);
          }

          const { data: productsData } = await api.get(`/products?${params.toString()}`);
          setProducts(productsData.data || []);
        } else {
          setProducts([]);
        }
      } else if (filterType === 'sale-products') {
        // Fetch products with discountPrice
        const params = new URLSearchParams();
        params.append('limit', 50);
        
        if (sortBy !== 'default') {
          params.append('sort', sortBy);
        }

        const { data: productsData } = await api.get(`/products?${params.toString()}`);
        const saleProdcts = (productsData.data || []).filter(p => p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price);
        setProducts(saleProdcts);
      } else {
        // All offers: both category offers and sale products
        const { data: categoriesData } = await api.get('/categories');
        const categories = categoriesData.data || categoriesData || [];
        const offerCategory = categories.find(cat => cat.type === 'offer');
        
        const params = new URLSearchParams();
        params.append('limit', 100);
        
        if (sortBy !== 'default') {
          params.append('sort', sortBy);
        }

        const { data: productsData } = await api.get(`/products?${params.toString()}`);
        const allProducts = productsData.data || [];
        
        // Combine category offers and sale products
        let offerProducts = [];
        
        if (offerCategory) {
          offerProducts = allProducts.filter(p => (p.category?._id || p.category) === offerCategory._id);
        }
        
        const saleProducts = allProducts.filter(p => p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price);
        
        // Merge and remove duplicates
        const productMap = new Map();
        [...offerProducts, ...saleProducts].forEach(p => productMap.set(p._id, p));
        setProducts(Array.from(productMap.values()));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch offer products:', error);
      setProducts([]);
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm mb-4 opacity-90">
            <Link to="/" className="hover:text-orange-200 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span>Special Offers</span>
          </div>
          <div className="flex items-center gap-4">
            <FaTags className="text-5xl" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Special Offers</h1>
              <p className="text-orange-100 text-lg">
                Grab the best deals and save big on your favorite products
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'all' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Offers
            </button>
            <button
              onClick={() => handleFilterChange('category-offers')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'category-offers' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaTags className="inline mr-2" />
              Special Collection
            </button>
            <button
              onClick={() => handleFilterChange('sale-products')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'sale-products' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaPercent className="inline mr-2" />
              Sale Products
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-600">
            {loading ? 'Loading...' : `${products.length} offer${products.length !== 1 ? 's' : ''} found`}
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
              <option value="-discountPercentage">Biggest Discount</option>
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
            <p className="text-gray-600 mt-4">Loading special offers...</p>
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
            <FaTags className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Offers Available</h3>
            <p className="text-gray-600 mb-6">
              Check back soon for exciting deals and discounts!
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

export default OffersPage;
