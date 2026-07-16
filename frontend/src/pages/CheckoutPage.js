import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('80');
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    address: '',
    orderNotes: '',
    shipToDifferentAddress: false,
    shippingAddress: ''
  });

  // Sync form data when user context loads asynchronously
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const orderItems = cartItems.map(item => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.discountPrice > 0 ? item.discountPrice : item.price,
        image: item.images && item.images.length > 0 ? item.images[0] : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E'
      }));

      const orderData = {
        orderItems,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email || undefined,
          address: formData.shipToDifferentAddress ? formData.shippingAddress : formData.address,
          city: 'Dhaka',
          street: formData.shipToDifferentAddress ? formData.shippingAddress : formData.address,
          postalCode: '1000'
        },
        paymentMethod: 'Cash on Delivery',
        itemsPrice: subtotal,
        shippingPrice: shippingCost,
        taxPrice: 0,
        totalPrice: total,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        discount: discount,
        orderNotes: formData.orderNotes || undefined
      };

      const { data } = await api.post('/orders', orderData);

      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/order/${data.data._id}`, { state: { fromCheckout: true } });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-gray-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-4 text-lg">
              <span className="text-gray-400">SHOPPING CART</span>
              <FaArrowRight className="text-gray-400" />
              <span className="font-semibold">CHECKOUT</span>
              <FaArrowRight className="text-gray-400" />
              <span className="text-gray-400">ORDER COMPLETE</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Please add items to your cart before checking out</p>
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Continue Shopping
          </button>
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
            <span className="text-gray-400">SHOPPING CART</span>
            <FaArrowRight className="text-gray-400" />
            <span className="font-semibold underline">CHECKOUT</span>
            <FaArrowRight className="text-gray-400" />
            <span className="text-gray-400">ORDER COMPLETE</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Coupon Section */}
        <div className="bg-gray-100 border border-gray-300 p-4 mb-8 rounded">
          <p className="text-gray-700">
            Have a coupon?{' '}
            <button
              onClick={() => setShowCoupon(!showCoupon)}
              className="text-red-600 hover:underline font-medium"
            >
              Click here to enter your code
            </button>
          </p>
          {showCoupon && (
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
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
          )}
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Billing Details */}
            <div>
              <h2 className="text-2xl font-bold mb-6">BILLING DETAILS</h2>
              
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email address (optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="muhtasim425@gmail.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House Name, Road, Sector/Block"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Ship to Different Address */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="shipToDifferentAddress"
                      checked={formData.shipToDifferentAddress}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Ship to a different address?</span>
                  </label>
                </div>

                {/* Shipping Address */}
                {formData.shipToDifferentAddress && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Shipping Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      placeholder="Enter shipping address"
                      required={formData.shipToDifferentAddress}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                )}

                {/* Order Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Order notes (optional)
                  </label>
                  <textarea
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Notes about your order, e.g. special notes for delivery."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Your Order */}
            <div>
              <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
                <h2 className="text-2xl font-bold mb-6 pb-3 border-b">YOUR ORDER</h2>

                {/* Order Items */}
                <div className="mb-4 pb-4 border-b">
                  <div className="flex justify-between font-semibold mb-3">
                    <span>PRODUCT</span>
                    <span>SUBTOTAL</span>
                  </div>
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-center py-2 text-sm">
                      <div className="flex items-center gap-2 flex-1">
                        <img
                          src={getImageUrl(item.images?.[0])}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"%3E%3Crect fill="%23f0f0f0" width="48" height="48"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <span className="flex-1">{item.name} × {item.quantity}</span>
                      </div>
                      <span className="font-medium">
                        {((item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity).toFixed(2)}৳
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotal */}
                <div className="flex justify-between mb-4 pb-4 border-b">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold text-red-600">{subtotal.toFixed(2)}৳</span>
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
                </div>

                {/* Total */}
                <div className="flex justify-between mb-6 text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-red-600">{total.toFixed(2)}৳</span>
                </div>

                {/* Payment Method */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Cash on delivery</h3>
                  <p className="text-sm text-gray-600">Pay with cash upon delivery.</p>
                </div>

                {/* Privacy Policy */}
                <p className="text-xs text-gray-600 mb-4">
                  Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{' '}
                  <Link to="/privacy" className="text-primary-600 hover:underline">
                    privacy policy
                  </Link>
                  .
                </p>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 bg-red-600 text-white font-semibold rounded-lg transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                  }`}
                >
                  {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
