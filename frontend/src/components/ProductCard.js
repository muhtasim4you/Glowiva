import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaExchangeAlt, FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  return baseUrl.replace(/\/api\/?$/, '') + imageUrl;
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToCompare } = useCompare();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [imageError, setImageError] = React.useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock > 0) {
      addToCart(product);
    } else {
      toast.error('Product out of stock');
    }
  };

  const handleAddToCompare = (e) => {
    e.preventDefault();
    addToCompare(product);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const discountPercentage = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  
  // Generate slug if not available
  const productSlug = product.slug || (product.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <div className="product-card group relative bg-white border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Image Container */}
      <Link to={`/product/${productSlug}`} className="relative block overflow-hidden bg-white">
        {discountPercentage > 0 && (
          <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-pink-600 text-white px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-bold z-10 rounded">
            -{discountPercentage}%
          </div>
        )}
        {product.newArrival && (
          <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-green-500 text-white px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-bold z-10 rounded">
            NEW
          </div>
        )}
        
        {!imageError && product.images && product.images[0] ? (
          <img
            src={getImageUrl(product.images[0])}
            alt={product.name}
            className="w-full h-48 md:h-64 lg:h-72 object-contain p-2 md:p-4 group-hover:brightness-105 transition-all duration-500"
            width={288}
            height={288}
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-48 md:h-64 lg:h-72 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <svg 
                className="mx-auto h-16 md:h-24 w-16 md:w-24 text-gray-300" 
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
              <p className="text-xs text-gray-400 mt-2 px-2">{product.name}</p>
            </div>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-2 md:p-4 border-t border-gray-100">
        {/* Product Name */}
        <Link to={`/product/${productSlug}`}>
          <h3 className="text-xs md:text-sm lg:text-base font-semibold mb-1 md:mb-2 text-gray-800 hover:text-pink-600 transition-colors line-clamp-2 min-h-[32px] md:min-h-[48px]">
            {product.name}
          </h3>
        </Link>

        {/* Category/Brand Tags */}
        <div className="text-[10px] md:text-xs text-gray-400 mb-1 md:mb-2 truncate">
          {product.category?.name && <span>{product.category.name}</span>}
          {product.brand?.name && (
            <>
              {product.category?.name && <span>, </span>}
              <span>{product.brand.name}</span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
          {discountPercentage > 0 ? (
            <>
              <span className="text-xs md:text-sm text-gray-400 line-through">
                {product.price.toFixed(2)}৳
              </span>
              <span className="text-sm md:text-base lg:text-lg font-bold text-pink-600">
                {effectivePrice.toFixed(2)}৳
              </span>
            </>
          ) : (
            <span className="text-sm md:text-base lg:text-lg font-bold text-gray-800">
              {product.price.toFixed(2)}৳
            </span>
          )}
        </div>

        {/* Description - Only on hover on desktop, hidden on mobile */}
        <div className="hidden md:block overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-20 opacity-0 group-hover:opacity-100">
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description || 'Refreshing product that cleanses deeply, controls oil, and boosts natural brightness for fresh, clear skin.'}
          </p>
        </div>

        {/* Action Buttons */}
        {/* Mobile: Always visible */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className={`p-2 border rounded-sm transition-colors ${
              isInWishlist(product._id)
                ? 'bg-pink-600 text-white border-pink-600'
                : 'border-gray-300 hover:border-pink-600 hover:text-pink-600'
            }`}
            title={isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <FaHeart size={12} />
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart(e);
            }}
            disabled={product.stock === 0}
            className="flex-1 bg-pink-600 text-white font-semibold py-2 px-2 rounded-sm hover:bg-pink-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed uppercase text-[10px]"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>

        {/* Desktop: Show on hover */}
        <div className="hidden md:flex items-center gap-2 overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-20 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className={`p-2.5 border rounded-sm transition-colors ${
              isInWishlist(product._id)
                ? 'bg-pink-600 text-white border-pink-600'
                : 'border-gray-300 hover:border-pink-600 hover:text-pink-600'
            }`}
            title={isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <FaHeart size={16} />
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart(e);
            }}
            disabled={product.stock === 0}
            className="flex-1 bg-pink-600 text-white font-semibold py-2.5 px-4 rounded-sm hover:bg-pink-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed uppercase text-sm"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          <Link
            to={`/product/${productSlug}`}
            className="p-2.5 border border-gray-300 rounded-sm hover:border-pink-600 hover:text-pink-600 transition-colors block"
            title="Quick View"
            onClick={(e) => e.stopPropagation()}
          >
            <FaExchangeAlt size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
