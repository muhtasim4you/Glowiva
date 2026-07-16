import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTimes, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('80');

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return baseUrl.replace(/\/api\/?$/, '') + imageUrl;
  };

  const subtotal = getCartTotal();
  const shippingCost = parseFloat(shippingMethod);
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = subtotal - discount + shippingCost;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      setCouponLoading(true);
      const { data } = await api.post('/coupons/validate', {
        code: couponCode,
        cartTotal: subtotal
      });

      if (data.success) {
        setAppliedCoupon(data.data);
        toast.success(`Coupon applied! You saved ৳${data.data.discount}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Coupon removed');
  };

  const handleUpdateCart = () => {
    toast.success('Cart updated');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-gray-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-4 text-lg">
              <span className="font-semibold">SHOPPING CART</span>
              <FaArrowRight className="text-gray-400" />
              <span className="text-gray-400">CHECKOUT</span>
              <FaArrowRight className="text-gray-400" />
              <span className="text-gray-400">ORDER COMPLETE</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link to="/products" className="inline-block px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4 text-lg">
            <span className="font-semibold">SHOPPING CART</span>
            <FaArrowRight className="text-gray-400" />
            <span className="text-gray-400">CHECKOUT</span>
            <FaArrowRight className="text-gray-400" />
            <span className="text-gray-400">ORDER COMPLETE</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Table Header */}
            <div className="bg-white rounded-t-lg border-b">
              <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 font-semibold text-gray-700">
                <div className="col-span-6">PRODUCT</div>
                <div className="col-span-2 text-center">PRICE</div>
                <div className="col-span-2 text-center">QUANTITY</div>
                <div className="col-span-2 text-center">SUBTOTAL</div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white">
              {cartItems.map((item, index) => (
                <div 
                  key={item._id} 
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center ${
                    index !== cartItems.length - 1 ? 'border-b' : ''
                  }`}
                >
                  {/* Product with Remove Button */}
                  <div className="col-span-12 md:col-span-6 flex items-center space-x-4">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      title="Remove item"
                    >
                      <FaTimes size={18} />
                    </button>
                    <img
                      src={getImageUrl(item.images?.[0])}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect fill="%23f0f0f0" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 line-clamp-2">{item.name}</h3>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-4 md:col-span-2 text-center">
                    <span className="md:hidden font-semibold text-gray-700">Price: </span>
                    <span className="font-medium">{(item.discountPrice > 0 ? item.discountPrice : item.price).toFixed(2)}৳</span>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-4 md:col-span-2 flex justify-center">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="w-12 text-center border-l border-r border-gray-300 py-2 focus:outline-none"
                      />
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity >= (item.stock || 999)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-4 md:col-span-2 text-center">
                    <span className="md:hidden font-semibold text-gray-700">Subtotal: </span>
                    <span className="font-bold text-primary-600">
                      {((item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity).toFixed(2)}৳
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon and Update Cart */}
            <div className="bg-white rounded-b-lg p-4 border-t flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary-500"
                  disabled={appliedCoupon !== null}
                />
                {appliedCoupon ? (
                  <button
                    onClick={handleRemoveCoupon}
                    className="px-6 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition-colors whitespace-nowrap"
                  >
                    REMOVE COUPON
                  </button>
                ) : (
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors whitespace-nowrap disabled:bg-gray-400"
                  >
                    {couponLoading ? 'APPLYING...' : 'APPLY COUPON'}
                  </button>
                )}
              </div>
              <button
                onClick={handleUpdateCart}
                className="px-6 py-2 border-2 border-gray-300 font-semibold rounded hover:bg-gray-50 transition-colors"
              >
                UPDATE CART
              </button>
            </div>
          </div>

          {/* Cart Totals */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-bold mb-6 pb-3 border-b">CART TOTALS</h2>
              
              {/* Subtotal */}
              <div className="flex justify-between mb-4 pb-4 border-b">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">{subtotal.toFixed(2)}৳</span>
              </div>

              {/* Discount (if coupon applied) */}
              {appliedCoupon && (
                <div className="flex justify-between mb-4 pb-4 border-b text-green-600">
                  <span className="font-medium">Discount ({appliedCoupon.code})</span>
                  <span className="font-semibold">-{discount.toFixed(2)}৳</span>
                </div>
              )}

              {/* Shipping */}
              <div className="mb-4 pb-4 border-b">
                <div className="font-medium mb-3">Shipment 1</div>
                <div className="space-y-2">
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shipping"
                      value="80"
                      checked={shippingMethod === '80'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mt-1"
                    />
                    <span className="text-sm">ঢাকার ভিতরে ৮০ টাকা: 80.00৳</span>
                  </label>
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shipping"
                      value="150"
                      checked={shippingMethod === '150'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mt-1"
                    />
                    <span className="text-sm">ঢাকার বাহিরে ১৫০ টাকা: 150.00৳</span>
                  </label>
                </div>
                <div className="mt-3 text-sm text-primary-600">
                  Shipping to <span className="font-medium">Dhaka</span>.
                  <button className="ml-1 underline hover:no-underline">Change address</button>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between mb-6 text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary-600">{total.toFixed(2)}৳</span>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="block w-full px-6 py-3 bg-red-600 text-white text-center font-semibold rounded hover:bg-red-700 transition-colors"
              >
                PROCEED TO CHECKOUT
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
