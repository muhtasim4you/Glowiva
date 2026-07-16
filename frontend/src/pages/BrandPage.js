import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { FaThLarge, FaTh, FaBars } from 'react-icons/fa';
import { toast } from 'react-toastify';

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  return baseUrl.replace(/\/api\/?$/, '') + imageUrl;
};

const BrandPage = () => {
  const { brandName } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid-4');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [stockFilter, setStockFilter] = useState({ onSale: false, inStock: false });
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    fetchBrandData();
  }, [brandName]);

  const fetchBrandData = async () => {
    try {
      // Fetch single brand by slug using the proper API endpoint
      const { data: brandData } = await api.get(`/brands/${brandName.toLowerCase()}`);
      const foundBrand = brandData.data || brandData;

      if (foundBrand) {
        setBrand(foundBrand);
        const { data: productsData } = await api.get(`/products?brand=${foundBrand._id}`);
        const productsArray = productsData.data || productsData.products || productsData || [];
        setProducts(productsArray);

        if (productsArray.length > 0) {
          const prices = productsArray.map(p => p.discountPrice || p.price);
          setMinPrice(Math.min(...prices));
          setMaxPrice(Math.max(...prices));
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }

        // Fetch top rated products for this brand
        const { data: topData } = await api.get(`/products?brand=${foundBrand._id}&sort=-ratings&limit=6`);
        const topProducts = topData.data || topData.products || topData || [];
        // Shuffle and pick 3 so they vary
        const shuffled = Array.isArray(topProducts) ? [...topProducts] : [];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setTopRatedProducts(shuffled.slice(0, 3));
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch brand data:', error);
      if (error.response?.status === 404) {
        toast.error('Brand not found');
      } else {
        toast.error('Failed to load brand information');
      }
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    let filtered = [...products];
    filtered = filtered.filter(p => {
      const price = p.discountPrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    if (stockFilter.onSale) filtered = filtered.filter(p => p.discountPrice);
    if (stockFilter.inStock) filtered = filtered.filter(p => p.stock > 0);
    
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => b.ratings - a.ratings);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const getGridClass = () => {
    switch (viewMode) {
      case 'grid-3': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 'grid-4': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      case 'grid-5': return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
      case 'list': return 'grid-cols-1';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading brand...</p>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Brand Not Found</h2>
          <Link to="/brands" className="text-primary-500 hover:underline">View All Brands</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold">{brand.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">FILTER BY PRICE</h3>
              <div className="mb-4">
                <input type="range" min={minPrice} max={maxPrice} value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full accent-primary-500"
                />
                <input type="range" min={minPrice} max={maxPrice} value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-primary-500 mt-2"
                />
              </div>
              <div className="text-sm mb-2">Price: {priceRange[0]}৳ — {priceRange[1]}৳</div>
              <button onClick={() => setPriceRange([minPrice, maxPrice])}
                className="text-primary-500 text-sm hover:underline">
                RESET
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">STOCK STATUS</h3>
              <label className="flex items-center mb-2">
                <input type="checkbox" checked={stockFilter.onSale}
                  onChange={(e) => setStockFilter({ ...stockFilter, onSale: e.target.checked })}
                  className="mr-2 accent-primary-500"
                />
                <span className="text-sm">On sale</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked={stockFilter.inStock}
                  onChange={(e) => setStockFilter({ ...stockFilter, inStock: e.target.checked })}
                  className="mr-2 accent-primary-500"
                />
                <span className="text-sm">In stock</span>
              </label>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">TOP RATED PRODUCTS</h3>
              <div className="space-y-4">
                {topRatedProducts.map((product) => (
                  <Link key={product._id} to={`/product/${product.slug}`}
                    className="flex gap-3 hover:bg-gray-50 p-2 rounded transition-colors">
                    <img 
                      src={getImageUrl(product.images?.[0]) || '/placeholder.png'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium line-clamp-2">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {product.discountPrice && (
                          <span className="text-xs text-gray-400 line-through">{product.price}৳</span>
                        )}
                        <span className="text-primary-500 font-bold">
                          {product.discountPrice || product.price}৳
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="lg:w-3/4">
            <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                DISCOVER RADIANT BEAUTY WITH
              </h2>
              <h3 className="text-3xl font-bold text-primary-500 mb-4">
                {brand.name.toUpperCase()} PRODUCTS
              </h3>
              <p className="text-gray-700 max-w-2xl">
                Indulge in {brand.name}'s elegant skincare collection, where nature meets refined science. 
                From soothing serums to restorative masks, each formula is crafted to reveal your skin's 
                most radiant, flawless self.
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="text-sm text-gray-600">
                <Link to="/" className="hover:text-primary-500">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">{brand.name}</span>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Show:</span>
                  {[9, 12, 18, 24].map(num => (
                    <button key={num} onClick={() => setItemsPerPage(num)}
                      className={`px-2 py-1 text-sm ${itemsPerPage === num ? 'text-primary-500 font-bold' : 'text-gray-600'}`}>
                      {num}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => setViewMode('grid-3')}
                    className={`p-2 ${viewMode === 'grid-3' ? 'text-primary-500' : 'text-gray-600'}`}>
                    <FaTh />
                  </button>
                  <button onClick={() => setViewMode('grid-4')}
                    className={`p-2 ${viewMode === 'grid-4' ? 'text-primary-500' : 'text-gray-600'}`}>
                    <FaThLarge />
                  </button>
                  <button onClick={() => setViewMode('grid-5')}
                    className={`p-2 ${viewMode === 'grid-5' ? 'text-primary-500' : 'text-gray-600'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <rect width="3" height="3" x="1" y="1"/>
                      <rect width="3" height="3" x="5.5" y="1"/>
                      <rect width="3" height="3" x="10" y="1"/>
                      <rect width="3" height="3" x="14.5" y="1"/>
                      <rect width="3" height="3" x="1" y="8.5"/>
                      <rect width="3" height="3" x="5.5" y="8.5"/>
                      <rect width="3" height="3" x="10" y="8.5"/>
                      <rect width="3" height="3" x="14.5" y="8.5"/>
                    </svg>
                  </button>
                </div>

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary-500">
                  <option value="default">Default sorting</option>
                  <option value="rating">Sort by rating</option>
                  <option value="newest">Sort by latest</option>
                  <option value="price-low">Sort by price: low to high</option>
                  <option value="price-high">Sort by price: high to low</option>
                </select>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className={`grid ${getGridClass()} gap-6`}>
                {filteredProducts.slice(0, itemsPerPage).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600">No products found for this brand.</p>
              </div>
            )}

            {filteredProducts.length > itemsPerPage && (
              <div className="mt-8 text-center text-sm text-gray-600">
                Showing {Math.min(itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
