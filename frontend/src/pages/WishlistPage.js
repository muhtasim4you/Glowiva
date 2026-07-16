import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTimes, FaHome, FaChevronRight, FaExchangeAlt } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  return baseUrl.replace(/\/api\/?$/, '') + imageUrl;
};

const WishlistPage = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart(product);
      toast.success('Added to cart!');
    } else {
      toast.error('Product out of stock');
    }
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
    setSelectedItems(selectedItems.filter(id => id !== productId));
  };

  const handleSelectItem = (productId) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter(id => id !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach(productId => {
      removeFromWishlist(productId);
    });
    setSelectedItems([]);
    toast.success('Selected items removed from wishlist');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-bold text-center mb-4">Wishlist</h1>
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <Link to="/" className="hover:text-white transition-colors">
              <FaHome className="inline" /> Home
            </Link>
            <FaChevronRight className="text-sm" />
            <span className="text-white">Wishlist</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">YOUR PRODUCTS WISHLIST</h2>
          {wishlist.length > 0 && selectedItems.length > 0 && (
            <button
              onClick={handleRemoveSelected}
              className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-2"
            >
              <FaTimes /> Remove Selected ({selectedItems.length})
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <FaHeart className="text-6xl text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 text-lg">Save your favorite products to come back later!</p>
            <Link
              to="/products"
              className="inline-block bg-pink-600 text-white px-10 py-4 rounded-lg hover:bg-pink-700 transition-colors font-semibold"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => {
              const productSlug = product.slug || (product.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              const discountPercentage = product.discountPrice > 0
                ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                : 0;
              const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

              return (
                <div
                  key={product._id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group relative"
                >
                  {/* Header with checkbox and remove */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      className="bg-white rounded-full p-1.5 shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Remove from wishlist"
                    >
                      <FaTimes size={14} />
                    </button>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(product._id)}
                      onChange={() => handleSelectItem(product._id)}
                      className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer bg-white"
                    />
                  </div>

                  {/* Product Image */}
                  <Link to={`/product/${productSlug}`} className="block relative bg-white">
                    {discountPercentage > 0 && (
                      <div className="absolute top-3 left-3 bg-pink-600 text-white px-2.5 py-1 text-xs font-bold z-10 rounded">
                        -{discountPercentage}%
                      </div>
                    )}
                    <div className="h-72 flex items-center justify-center p-6">
                      {product.images && product.images[0] ? (
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                          <svg 
                            className="h-20 w-20 text-gray-300" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={1} 
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="p-4 border-t border-gray-100">
                    <Link to={`/product/${productSlug}`}>
                      <h3 className="text-base font-semibold text-gray-900 hover:text-pink-600 transition-colors mb-2 line-clamp-2 min-h-[3rem]">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {/* Categories/Tags */}
                    <div className="text-xs text-gray-400 mb-3 line-clamp-1">
                      {product.category?.name && <span>{product.category.name}</span>}
                      {product.brand?.name && (
                        <>
                          {product.category?.name && <span>, </span>}
                          <span>{product.brand.name}</span>
                        </>
                      )}
                      {product.subcategory && (
                        <>
                          <span>, </span>
                          <span>{product.subcategory}</span>
                        </>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      {discountPercentage > 0 ? (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            {product.price.toFixed(2)}৳
                          </span>
                          <span className="text-lg font-bold text-pink-600">
                            {effectivePrice.toFixed(2)}৳
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          {product.price.toFixed(2)}৳
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {product.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="flex-1 bg-pink-600 text-white py-2.5 px-4 rounded hover:bg-pink-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-semibold"
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                      <Link
                        to={`/product/${productSlug}`}
                        className="p-2.5 border border-gray-300 rounded hover:border-pink-600 hover:text-pink-600 transition-colors flex items-center justify-center"
                        title="Quick View"
                      >
                        <FaExchangeAlt size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
