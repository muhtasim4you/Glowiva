import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FaSearch, FaBox, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  return baseUrl.replace(/\/api\/?$/, '') + imageUrl;
};

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      // Try to fetch the order by ID
      const { data } = await api.get(`/orders/${orderId}`);
      
      // Verify email matches (case-insensitive)
      if (data.data?.user?.email?.toLowerCase() === email.toLowerCase()) {
        setOrder(data.data);
      } else {
        setError('Order not found. Please check your Order ID and Email.');
      }
    } catch (err) {
      setError('Order not found. Please check your Order ID and Email.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500 text-3xl" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500 text-3xl" />;
      case 'shipped':
        return <FaTruck className="text-blue-500 text-3xl" />;
      default:
        return <FaBox className="text-yellow-500 text-3xl" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusSteps = (status) => {
    const steps = [
      { name: 'Order Placed', value: 'pending', active: true },
      { name: 'Processing', value: 'processing', active: false },
      { name: 'Shipped', value: 'shipped', active: false },
      { name: 'Delivered', value: 'delivered', active: false }
    ];

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status?.toLowerCase());

    return steps.map((step, index) => ({
      ...step,
      active: index <= currentIndex,
      current: statusOrder[index] === status
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-600 hover:text-primary-500">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">Track Order</span>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg p-8 md:p-12 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Track Your Order</h1>
          <p className="text-lg md:text-xl opacity-90">
            Enter your order details to track your delivery status
          </p>
        </div>

        {/* Track Order Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8 max-w-2xl mx-auto">
          <form onSubmit={handleTrackOrder}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your Order ID (e.g., 65f8...)"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Your Order ID can be found in your order confirmation email
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Use the email address you used when placing the order
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <FaSearch />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Status Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                {getStatusIcon(order.orderStatus)}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h2>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>
              </div>

              {/* Progress Steps */}
              {order.orderStatus?.toLowerCase() !== 'cancelled' && (
                <div className="mb-8">
                  <div className="flex justify-between items-center">
                    {getStatusSteps(order.orderStatus).map((step, index, array) => (
                      <div key={step.value} className="flex items-center flex-1">
                        <div className="flex flex-col items-center relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.active ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-400'
                          }`}>
                            {step.active ? '✓' : index + 1}
                          </div>
                          <span className={`text-xs mt-2 text-center ${step.active ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                            {step.name}
                          </span>
                        </div>
                        {index < array.length - 1 && (
                          <div className={`flex-1 h-1 mx-2 ${step.active ? 'bg-pink-600' : 'bg-gray-200'}`}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Order Details</h3>
                  <p className="text-gray-600 text-sm">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-gray-600 text-sm">Payment Method: {order.paymentMethod}</p>
                  <p className="text-gray-600 text-sm">Total Amount: ৳{order.totalPrice}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Delivery Address</h3>
                  <p className="text-gray-600 text-sm">{order.shippingAddress.address}</p>
                  <p className="text-gray-600 text-sm">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p className="text-gray-600 text-sm">{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 border-b border-gray-200 pb-4 last:border-0">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">৳{item.price}</p>
                      <p className="text-gray-600 text-sm">Subtotal: ৳{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 mt-6 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>৳{order.itemsPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>৳{order.shippingPrice}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-৳{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-800 border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span>৳{order.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about your order, please contact our customer service team.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="tel:+8801314893055" className="flex items-center gap-2 text-pink-600 hover:text-pink-700">
                  📞 +8801314893055
                </a>
                <a href="mailto:studycrip@gmail.com" className="flex items-center gap-2 text-pink-600 hover:text-pink-700">
                  ✉️ studycrip@gmail.com
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Help Section (when no order is displayed) */}
        {!order && (
          <div className="bg-gray-100 rounded-lg p-8 text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Having Trouble?</h3>
            <div className="text-left space-y-3 text-gray-600">
              <p>• Make sure you're using the correct Order ID from your confirmation email</p>
              <p>• Check that your email address matches the one used during checkout</p>
              <p>• Order ID is case-sensitive, please enter it exactly as shown</p>
              <p>• If you still can't track your order, contact our support team</p>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-300">
              <p className="text-gray-700 mb-3">Contact Customer Service:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="tel:+8801314893055" className="text-pink-600 hover:text-pink-700 font-medium">
                  📞 +8801314893055
                </a>
                <a href="mailto:studycrip@gmail.com" className="text-pink-600 hover:text-pink-700 font-medium">
                  ✉️ studycrip@gmail.com
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
