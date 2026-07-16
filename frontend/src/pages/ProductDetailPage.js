import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaHeart, FaExchangeAlt, FaHome, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  return baseUrl.replace(/\/api\/?$/, '') + imageUrl;
};

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    comment: '',
    saveInfo: false
  });
  const { addToCart } = useCart();
  const { addToCompare } = useCompare();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
    setProduct(null);
    setLoading(true);
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${slug}`);
      const productData = data.data || data;
      setProduct(productData);
      setLoading(false);
      
      // Fetch related products - get more than needed so we can shuffle and pick varied ones
      if (productData.category) {
        const categoryId = productData.category._id || productData.category;
        const { data: relatedData } = await api.get(`/products?category=${categoryId}&limit=20`);
        const related = relatedData.data || relatedData.products || relatedData;
        if (Array.isArray(related)) {
          // Remove current product, shuffle, then pick 4
          const filtered = related.filter(p => p._id !== productData._id);
          for (let i = filtered.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
          }
          setRelatedProducts(filtered.slice(0, 4));
        } else {
          setRelatedProducts([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product');
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, quantity);
    } else {
      toast.error('Product out of stock');
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'increment' && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link to="/products" className="text-primary-500 hover:underline">Back to Products</Link>
        </div>
      </div>
    );
  }

  const discountPercentage = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-500 flex items-center">
              <FaHome className="mr-1" /> Home
            </Link>
            {product.category && (
              <>
                <FaChevronRight className="mx-2 text-xs" />
                <Link to={`/category/${product.category.slug}`} className="hover:text-primary-500">
                  {product.category.name}
                </Link>
              </>
            )}
            {product.brand && (
              <>
                <FaChevronRight className="mx-2 text-xs" />
                <span>{product.brand.name}</span>
              </>
            )}
            <FaChevronRight className="mx-2 text-xs" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative bg-gray-50 rounded-lg overflow-hidden group">
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-pink-600 text-white px-3 py-1 text-sm font-bold z-10 rounded">
                    -{discountPercentage}%
                  </div>
                )}
                <img
                  src={getImageUrl(product.images && product.images[selectedImage]) || '/placeholder.jpg'}
                  alt={product.name}
                  width={600}
                  height={384}
                  className="w-full h-96 object-contain p-8"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%23d1d5db"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /%3E%3C/svg%3E';
                  }}
                />
                <button
                  className="absolute bottom-4 left-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  title="Zoom"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </button>
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                        selectedImage === index ? 'border-pink-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        loading="lazy"
                        className="w-full h-full object-contain p-1"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                {product.brand && (
                  <div className="flex items-center mb-4">
                    {product.brand.logo ? (
                      <img
                        src={getImageUrl(product.brand.logo)}
                        alt={product.brand.name}
                        width={120}
                        height={48}
                        loading="lazy"
                        className="h-12 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<span class="text-xl font-bold text-gray-700">${product.brand.name}</span>`;
                        }}
                      />
                    ) : (
                      <span className="text-xl font-bold text-gray-700">{product.brand.name}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                {discountPercentage > 0 && (
                  <span className="text-xl text-gray-400 line-through">{product.price.toFixed(2)}৳</span>
                )}
                <span className="text-3xl font-bold text-pink-600">{effectivePrice.toFixed(2)}৳</span>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed">{product.description}</p>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => handleQuantityChange('decrement')}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-16 text-center border-x border-gray-300 py-2"
                    />
                    <button
                      onClick={() => handleQuantityChange('increment')}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-pink-600 text-white font-semibold py-3 px-8 rounded hover:bg-pink-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed uppercase"
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`flex-1 flex items-center justify-center gap-2 border py-2 px-4 rounded transition-colors ${
                      isInWishlist(product._id)
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'border-gray-300 hover:border-pink-600 hover:text-pink-600'
                    }`}
                  >
                    <FaHeart /> {isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  </button>
                  <button
                    onClick={() => {
                      addToCompare(product);
                      toast.success('Added to compare');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded hover:border-pink-600 hover:text-pink-600 transition-colors"
                  >
                    <FaExchangeAlt /> Compare
                  </button>
                </div>
              </div>

              {/* Categories and Tags */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-start">
                  <span className="font-semibold text-gray-700 w-24">Categories:</span>
                  <div className="flex flex-wrap gap-1">
                    {product.category && (
                      <Link to={`/category/${product.category.slug}`} className="text-gray-600 hover:text-pink-600">
                        {product.category.name}
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold text-gray-700 w-24">Tags:</span>
                  <div className="flex flex-wrap gap-2 text-gray-600 text-sm">
                    {product.brand && <span>{product.brand.name}</span>}
                    {product.category && <span>, {product.category.name}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-md mt-8 overflow-hidden">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'description'
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                DESCRIPTION
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'reviews'
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                REVIEWS (0)
              </button>
              <button
                onClick={() => setActiveTab('brand')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'brand'
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                ABOUT BRAND
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'shipping'
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                SHIPPING & DELIVERY
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description || 'No description available.'}
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side - Reviews list */}
                <div className="lg:col-span-1">
                  <h3 className="text-xl font-bold mb-4">Reviews</h3>
                  <p className="text-gray-600">There are no reviews yet.</p>
                </div>

                {/* Right side - Review form */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-semibold mb-4">
                    Be the first to review "{product.name}"
                  </h3>
                  
                  <form 
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (rating === 0) {
                        toast.error('Please select a rating');
                        return;
                      }
                      toast.success('Thank you for your review!');
                      setReviewForm({ name: '', email: '', comment: '', saveInfo: false });
                      setRating(0);
                    }}
                  >
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Your email address will not be published. Required fields are marked <span className="text-red-500">*</span>
                      </label>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-2">
                      <label className="text-gray-700">
                        Your rating <span className="text-red-500">*</span>:
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="text-2xl transition-colors focus:outline-none"
                          >
                            <span className={
                              star <= (hoverRating || rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }>
                              ★
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Review Text */}
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Your review <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows="6"
                        required
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-pink-500"
                        placeholder="Write your review here..."
                      ></textarea>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={reviewForm.email}
                        onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    {/* Save checkbox */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="saveInfo"
                        checked={reviewForm.saveInfo}
                        onChange={(e) => setReviewForm({ ...reviewForm, saveInfo: e.target.checked })}
                        className="rounded"
                      />
                      <label htmlFor="saveInfo" className="text-gray-700 text-sm">
                        Save my name, email, and website in this browser for the next time I comment.
                      </label>
                    </div>

                    {/* Submit button */}
                    <div>
                      <button
                        type="submit"
                        className="bg-red-600 text-white font-semibold px-8 py-3 rounded hover:bg-red-700 transition-colors uppercase"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'brand' && (
              <div className="prose max-w-none">
                {product.brand ? (
                  <div>
                    <h3 className="text-2xl font-bold mb-4">{product.brand.name}</h3>
                    <p className="text-gray-700">{product.brand.description || 'Premium beauty and skincare brand.'}</p>
                  </div>
                ) : (
                  <p className="text-gray-600">Brand information not available.</p>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold mb-4">Shipping & Delivery</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Free shipping on orders over 1000৳</li>
                  <li>Standard delivery within 3-5 business days</li>
                  <li>Express delivery available (1-2 business days)</li>
                  <li>Cash on delivery available</li>
                  <li>Easy returns within 7 days</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">RELATED PRODUCTS</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
